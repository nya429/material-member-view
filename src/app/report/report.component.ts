import { ReportService } from './report.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  siteList = [];
  showState = [];

  statusChangeSubscription: Subscription;

  constructor(private statusService: ReportService) { }
  
  ngOnInit() { 
    this.statusChangeSubscription = this.statusService.statusListChanged.subscribe(siteStatusList => 
      this.onStatusChanged(siteStatusList));
    this.getStatus();
  }

  getStatus() {
    console.log('hey')
    if(this.siteList != null && this.siteList.length > 0) {
      this.siteList.map(site => {
        site.status = 'PENDING'
        site.operations.map(opt => opt.status = 'PENDING');
      });
    }
    this.statusService.getHttpStatus();
  }

  onStatusChanged(siteStatusList) {
    this.showState = siteStatusList.map(site => false);
    this.siteList = siteStatusList.map(site => ({...site}));
  }



  pendingToSuccess() {
    this.siteList.map(site => {
      if(site.status === 'PENDING') {
        setTimeout(() => {
          site.status = 200;
        }, 2000);
      }
    })
  }
 
  onToggle(index: number) {
    this.showState[index] = !this.showState[index];
  }
}

function random(options) {
  return options[Math.floor(Math.random() * options.length - 2) + 2];
}