import { Component, OnInit } from '@angular/core';
import { randomBytes } from 'crypto';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  showState = [false, false, false, false];

  statusOptions = {
     opts: ['Access', 'Login', 'Process', 'Logout', 'Mp_import', 'Backup'],
     status: [200, 301, 404, 500, 'PENDING'],
  };

  ok = [200, 404];

  siteList = [{
    url:  'commonwealthcare.org',
    opts: random(this.statusOptions.opts),
    status: random(this.statusOptions.status),
    runtime: Date.now()
  },
  {
    url:  'commonwealthcare.org',
    opts: random(this.statusOptions.opts),
    status: random(this.statusOptions.status),
    runtime: Date.now()
  },
  {
    url:  'commonwealthcare.org',
    opts: random(this.statusOptions.opts),
    status: random(this.statusOptions.status),
    runtime: Date.now()
  },
  {
    url:  'commonwealthcare.org',
    opts: random(this.statusOptions.opts),
    status: random(this.statusOptions.status),
    runtime: Date.now()
  }];

  constructor() { }
  
  ngOnInit() { 
    this.pendingToSuccess();
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
    console.log(this.showState);
  }
}

function random(options) {
  return options[Math.floor(Math.random() * options.length - 2) + 2];
}