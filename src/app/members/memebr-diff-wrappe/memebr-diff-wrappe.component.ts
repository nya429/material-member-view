import { MemberListService } from './../member-list.service';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-memebr-diff-wrappe',
  templateUrl: './memebr-diff-wrappe.component.html',
  styleUrls: ['./memebr-diff-wrappe.component.css']
})
export class MemebrDiffWrappeComponent implements OnInit {

  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
  }

  @HostListener('window:resize')
  onresize() {
    this.memberListService.onWindowResize();
  }
}
