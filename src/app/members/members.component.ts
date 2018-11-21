import { Subscription } from 'rxjs';
import { fadeAnimation } from './member.animation';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [ fadeAnimation ]
})
export class MembersComponent implements OnInit {
  links = ['cca', 'state', 'diff'];
  activeLink = this.links[0];

  constructor(private router: Router) { }

  ngOnInit() {
    // this.router.subscribe(val=> console.log(val))
  }

  onNavigate(link) {
    this.activeLink = link;
    // this.router.navigate(link);
  }

  getState(outlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : '';
  }
}
