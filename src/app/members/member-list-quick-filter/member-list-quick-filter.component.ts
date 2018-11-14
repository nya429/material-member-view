import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberListService } from './../member-list.service';

@Component({
  selector: 'app-member-list-quick-filter',
  templateUrl: './member-list-quick-filter.component.html',
  styleUrls: ['./member-list-quick-filter.component.css']
})
export class MemberListQuickFilterComponent implements OnInit, OnDestroy {
  @ViewChild('f') filterForm: NgForm;

  membersChangedSubscription: Subscription;

  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.membersChangedSubscription = this.memberListService.membersChanged.subscribe(() => 
      this.onFilterReset());
  }

  ngOnDestroy() {
    this.membersChangedSubscription.unsubscribe();
  }

  onLookup() {
    this.memberListService.quickLookup(this.filterForm.value.filterStr);
  }

  onFilterReset() {
    this.filterForm.reset();
    this.memberListService.quickLookup('');
  }

  masterToggle() {
    this.memberListService.toggleMatchSelect();
  }

  getMatchNum() {
    return this.memberListService.getMatchNum();
  }

  isAllMatchSelected(): boolean {
    return this.filterForm.value.filterStr.length > 0 ? 
    this.memberListService.isAllMatchSelected() : false;
  }

  isMatchSelected() {
    return this.filterForm.value.filterStr && this.filterForm.value.filterStr.length > 0 ? 
    this.memberListService.isMatchSelected() : false; 
  }
}