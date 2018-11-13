import { MemberListService } from './../member-list.service';
import { Subject, Subscription } from 'rxjs';
import { listExpandTrigger } from './../member.animation';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css'],
  animations: [listExpandTrigger]

})
export class TypeaheadComponent implements OnInit, OnChanges, OnDestroy {
  @Input() typeSuggestions: [{start: number, suggestion: string}];
  @Input() searchString: string;

  @Output() itemSelected = new EventEmitter<any> ();
  
  keyupSubscription: Subscription;
  keyupIndex: number;

  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.keyupIndex = -1;
    this.keyupSubscription = this.memberListService.typeAheadArrowed.subscribe((key: string) => this.onTypeaheadArrowed(key));
  }

  ngOnDestroy() {
    this.keyupSubscription.unsubscribe();
  }

  ngOnChanges() {
    console.log('searchString',this.searchString, this.typeSuggestions)
    if (this.searchString && this.searchString.length > 0) {
      this.highlightMatches();
    } 
  }

  highlightMatches() {
    if(!this.typeSuggestions) {
      return;
    }

    this.typeSuggestions.map(suggestionObj => {
      suggestionObj['beforeMatchText'] = suggestionObj.suggestion.slice(0, suggestionObj.start);
      suggestionObj['matchText'] = suggestionObj.suggestion.slice(suggestionObj.start, suggestionObj.start + this.searchString.length);
      suggestionObj['afterMatchText'] = suggestionObj.suggestion.slice(suggestionObj.start + this.searchString.length, suggestionObj.suggestion.length);
    })
  }

  onSelectItem(suggestion) {
    this.itemSelected.emit(suggestion);
  }

  onTypeaheadArrowed(key: string) {
    console.log(this.keyupIndex)
    switch(key) {
      case 'up':
      this.keyupIndex = this.keyupIndex !== 0 ? this.keyupIndex - 1 : this.typeSuggestions.length - 1;
      break;
      case 'down':
      this.keyupIndex = this.keyupIndex !== this.typeSuggestions.length - 1 ? this.keyupIndex + 1 : 0;
      break;
      case 'enter':
      this.keyupIndex !== -1 ? this.onSelectItem(this.typeSuggestions[this.keyupIndex].suggestion): null;
      break;
      default:
      break;
    }
  }
}
