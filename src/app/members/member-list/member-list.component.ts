import { Subscription } from 'rxjs';
import { MemberListService } from './../member-list.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';


export interface PeriodicElement {
  lastName: string;
  firstName: string;
  address: string;
  dob: string;
  mdsStatus: string;
  contactStatus: string;
  program: string;
}



@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {
  @ViewChild('table') private tableContainer: ElementRef;
  displayedColumns: string[] = ['select', 'firstName', 'lastName', 'dob', 'address', 'ccaid', 'program', 'enrollment'];
  dataSource = ELEMENT_DATA;
  sortedData = [];
  pagedData = [];
  /** on memebr change */
  membersLoading = false;
  /** member quick lookup */
  memberLookupMatches = [];
  isLookup = false;
  /** member multiple selection */
  selection = new SelectionModel<PeriodicElement>(true, []);

  // pagination
  // data.Source.lenth will be used only for the first time
  count = this.dataSource.length;
  pageIndex = 0;
  // set as options changed
  pageSize = 50;
  // preset
  sortCloumn: string;
  sortDirection;
  pageSizeOptions: number[] = [10, 50, 100];
  
  /** Subscriptions */
  memberLoadingSubscription: Subscription;
  memebrFilterResetedSubscription: Subscription;
  membersChangedSubscription: Subscription;
  memebrLookupSubscription: Subscription;
  memebrMatchSelectSubscription: Subscription;

  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.sortedData = this.dataSource.slice();
    this.pagedData = this.sortedData.slice(this.pageIndex, this.pageIndex + this.pageSize);


    this.memberLoadingSubscription = this.memberListService.memberLoading.subscribe(() => this.membersLoading = true);
    this.memebrFilterResetedSubscription = this.memberListService.memebrFilterReseted.subscribe(() => this.onFilterReseted());
    this.membersChangedSubscription = this.memberListService.membersChanged.subscribe(data => this.onMemberChanged(data));
    this.memebrLookupSubscription = this.memberListService.memberLookuped.subscribe(
      (lookupState: {matches: number[], isLooking: boolean}) => this.onMembersLookingup(lookupState) );
    this.memebrMatchSelectSubscription = this.memberListService.memberMatchSelected.subscribe(isSelect => this.onSelectMatchedMemebr(isSelect));
      
    
    this.pageIndex = 0;
    this.memberListService.paginateMemberList(this.pageIndex, this.pageSize, this.sortCloumn, this.sortDirection);
  }

  ngOnDestroy() {
    this.memberLoadingSubscription.unsubscribe(); 
    this.memebrFilterResetedSubscription.unsubscribe();
    this.membersChangedSubscription.unsubscribe();
    this.memebrLookupSubscription.unsubscribe();
    this.memebrMatchSelectSubscription.unsubscribe();
  }
 
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.pagedData.length;
    return numSelected == numRows;
  }

  onMemebrSelect(row) {
    this.selection.toggle(row);
    this.memberListService.selectMember(this.selection.selected, this.pagedData.length);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.pagedData.forEach(row => this.selection.select(row));
    
    this.memberListService.selectMember(this.selection.selected, this.pagedData.length);
  }

  onSort(e: Sort) {
    let active = e.active;
    let direction = e.direction;
    if (direction) {
      switch (active) {
        case 'lastName': this.sortCloumn = 'nn.NAME_LAST'; break;
        case 'firstName': this.sortCloumn = 'nn.NAME_FIRST'; break;
        case 'dob': this.sortCloumn = 'nn.BIRTH_DATE'; break;
      }
      this.sortDirection = direction;
    } else {
      this.sortCloumn = null;
      this.sortDirection = null;
    }
    this.pageIndex = 0;
    this.memberListService.paginateMemberList(this.pageIndex, this.pageSize, this.sortCloumn, this.sortDirection);
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;      // offset
    this.pageSize = e.pageSize;        // limit
    this.count = e.length;            // count
    const offset = (this.pageIndex) * this.pageSize                 // 0 based
    
    this.memberListService.paginateMemberList(offset, this.pageSize, this.sortCloumn, this.sortDirection);
  }

  onFilterReseted() {
    this.pageIndex = 0;
    this.memberListService.paginateMemberList(this.pageIndex, this.pageSize, this.sortCloumn, this.sortDirection);
  }

  onMemberChanged(data) {
    this.membersLoading = false;
    this.pagedData = data['members']
    this.pageIndex = data['offset'] / data['limit'];     
    this.pageSize = data['limit'];     
    this.count = data['count'];   
    /** reset the memebr selection  */
    this.selection.clear();
    /** set the member selection in action */
    this.memberListService.selectMember(this.selection.selected, this.pagedData.length);
  } 

  onMembersLookingup(lookupState: {matches: number[], isLooking: boolean}) {
    if (lookupState.isLooking) {
      this.memberLookupMatches = lookupState.matches;
      this.isLookup = true;
    } else {
      this.memberLookupMatches = [];
      this.isLookup = false;
    }
  }

  isHighlight(i: number) {
    return this.isLookup && this.memberLookupMatches.includes(i);
  }

  isDeHighlight(i: number) {
    return this.isLookup && !this.memberLookupMatches.includes(i);
  }

  onSelectMatchedMemebr(isSelect) {
    this.memberLookupMatches.forEach(index => isSelect ?
       this.selection.select(this.pagedData[index]) :
       this.selection.deselect(this.pagedData[index]));
    this.memberListService.selectMember(this.selection.selected, this.pagedData.length);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

const ELEMENT_DATA: PeriodicElement[] = [{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Boston, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , NORFOLK', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Boston, MA 02138 , NORFOLK', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , SUFFOLK', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , SUFFOLK', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , FRANKLIN', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , FRANKLIN', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , FRANKLIN', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , FRANKLIN', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , FRANKLIN', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbrahim', 'firstName': 'Mahida', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/13/1972', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abbadessa', 'firstName': 'Ismail', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '04/08/1886', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abel', 'firstName': 'Richard', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/11/1974', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abdo', 'firstName': 'Taramattie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '02/23/1958', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Abucar', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/26/1945', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Zubaydah ', 'firstName': 'Maureen', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '05/09/1959', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Yeshi', 'firstName': 'Fatna', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '03/17/1986', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'rivera', 'firstName': 'Amanda', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '11/24/1970', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'gonzalez', 'firstName': 'Raheemah', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '10/11/1933', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'},
{'lastName': 'Abelson', 'firstName': 'Marie', 'address': '13 STANDISH ST Cambridge, MA 02138 , MIDDLESEX', 
'dob': '01/06/1980', 'mdsStatus': 'MDS Approved', 'contactStatus': 'Appointment Made', 'program': 'ICO'}];