import { listExpandTrigger } from './../member.animation';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MemberListService } from '../member-list.service';
import { DateAdapter } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-list-filter',
  templateUrl: './member-list-filter.component.html',
  styleUrls: ['./member-list-filter.component.css'],
  animations: [listExpandTrigger]
})
export class MemberListFilterComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;

  private matchs;
  private arrowed: boolean;;
  private searchStr: string; 
  private typeHeadTimer;

  private typeSuggestSubscription: Subscription;  
  private careLocationsscription: Subscription;

  careCounties: {key: string, value:string}[];
  careCities: {key: string, value:string}[];
  programs: object[];

  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.initCareLocations();
    this.initPrograms();
    this.initForm();
    this.matchs = [];
    this.typeSuggestSubscription = this.memberListService.typeSuggested.subscribe(match => this.matchs = match)
    this.careLocationsscription = this.memberListService.careLocationLoaded.subscribe(reuslt => this.loadCareLocation(reuslt));
  }

  ngOnDestroy() {
    this.typeSuggestSubscription.unsubscribe();
    this.careLocationsscription.unsubscribe();
  }

  initCareLocations() {
    this.memberListService.getCareLocations();
  }

  loadCareLocation(locations: {counties:{key: string, value:string}[],
    cities:{key: string, value:string}[]}) {
    this.careCounties = locations.counties;
    this.careCities = locations.cities;
  }
  
  initForm() {
    this.filterForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.max(50)]
      }),
      dob: new FormControl('', 
        { validators: [] }),
      city: new FormControl('', 
        {validators: []}),
      county: new FormControl('', 
        {validators: []}),
      program: new FormControl('', 
        {validators: []}),
      programStartDate: new FormControl('', 
        { validators: [] }),
      programEndDate: new FormControl('', 
        { validators: [] }),
      disenrolled: new FormControl(false, 
        {validators: []})
    });
  }

  patchForm() {
    this.filterForm.reset();
  }

  initPrograms() {
    this.programs = this.memberListService.getPrograms();
  }
  
  onSearch() {
    const form = this.filterForm.value;
    if (form.name && form.name.trim().length > 1) {
      const nameSegs = form.name.split(' ');
      form.firstName = nameSegs[0];
      form.lastName = nameSegs[1];
    } else {
      form.firstName = null;
      form.lastName = null;
    }

    this.memberListService.serachMemebr(this.filterForm.value);
    this.filterForm.patchValue(form)
  }

  onClearFilter() {
    this.patchForm();
    this.memberListService.filterReset();
  }

  onQuickSearch($e) {
    console.log($e.key)
    clearInterval(this.typeHeadTimer);
    if ($e.key === 'Enter' || $e.key === 'Escape') {
      return;
    } 

    this.searchStr = this.filterForm.value.name.toLowerCase();
    if (this.searchStr.length > 1 && this.searchStr.trim() != '') {
      console.log('search time', this.searchStr)
      setTimeout(() => {
        this.typeHeadTimer = this.memberListService.typeAhead({"search_str": this.searchStr})
      }, 200); 
    } else {
      console.log('onSuggestionDismiss')
      this.onSuggestionDismiss();
    }
  }

  onItemSelected(event) {
    this.filterForm.patchValue({name: event})
    this.searchStr = event;
    this.onSuggestionDismiss();
  }

  onSuggestionDismiss() {
    this.arrowed = false;
    this.matchs = [];
  }

  exactdate(e) {
              
  }

  onkeyup() {
    if (this.matchs.length > 0) {
      this.memberListService.typeAheadArrow('up');
      this.arrowed = true;
    } 
  }

  onkeydown() {
    if(this.matchs.length > 0) {
      this.memberListService.typeAheadArrow('down');
      this.arrowed = true;
    } 
  }

  onkeyenter($e) {
    if(this.matchs.length > 0 && this.arrowed) {
      this.memberListService.typeAheadArrow('enter');
      $e.preventDefault();
    } else if (this.matchs.length > 0 && !this.arrowed) {
      this.onSuggestionDismiss();
      this.onSearch();
    } else {
      this.onSearch();
    }
  }

  onkeydownenter($e) {
    $e.preventDefault();
  }
}