import { MemberListService } from './../member-list.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-member-list-action',
  templateUrl: './member-list-action.component.html',
  styleUrls: ['./member-list-action.component.css']
})
export class MemberListActionComponent implements OnInit, OnDestroy {
  memberSelection: object[];
  numRow: number;
  memberSelectSubscription: Subscription;
  @ViewChild('b') button: ElementRef;
  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.memberSelection = [];
    this.numRow = 0;
    this.memberSelectSubscription = this.memberListService.membersSelected.subscribe(selection => this.onMemberSelected(selection))
  }

  ngOnDestroy() {
    this.memberSelectSubscription.unsubscribe();
  }

  onMemberSelected(selection) {
    this.memberSelection = selection.selected;
    this.numRow = selection.numRow;
  }
  
  downloadFile() {
    const data = this.memberSelection;
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], {type: 'text/csv' }),
    url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
        //Now convert each value to string and comma-separated
        row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

}
