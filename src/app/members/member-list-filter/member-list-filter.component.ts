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

  onQuickSearch() {
    clearInterval(this.typeHeadTimer);
    this.searchStr = this.filterForm.value.name.toLowerCase();
    if (this.searchStr.length > 1) {
      setTimeout(() => {
        this.typeHeadTimer = this.memberListService.typeAhead({"search_str": this.searchStr})
      }, 150); 
    } else {
      this.matchs = [];
    }
  }

  onItemSelected(event) {
    this.filterForm.patchValue({name: event})
    this.matchs = [];
  }

  onSuggestionDismiss() {
    this.matchs = [];
  }

  exactdate(e) {
    e.checked
  }
}