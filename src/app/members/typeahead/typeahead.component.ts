import { Subject } from 'rxjs';
import { listExpandTrigger } from './../member.animation';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css'],
  animations: [listExpandTrigger]

})
export class TypeaheadComponent implements OnInit, OnChanges {
  @Input() typeSuggestions: [{start: number, suggestion: string}];
  @Input() searchString: string;

  @Output() itemSelected = new EventEmitter<any> ();
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('searchString',this.searchString)
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
}
