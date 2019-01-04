import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  siteStatusList: Array<object>;
  statusListChanged = new Subject<Array<object>> ();
  statusChartChanged = new Subject<Array<number>> ();

  constructor(private httpClient: HttpClient) { }

  getStatus() {
    setTimeout(() => {
      console.log('service get')
      this.statusListChanged.next(siteList);
      this.getStatusCount(siteList);
    }, 1000) 
  }

  getHttpStatus() {
    return this.httpClient.get(`http://sqadevws02/api/statuslist` , {
      observe: 'body',
      responseType: 'json',
    }).subscribe((result: Array<object>) => {
      this.siteStatusList = result;
      this.getStatusCount(result);
      this.statusListChanged.next(result)

      console.log(result);

    });
  }

  getStatusCount(result) { 
      let failCount = 0;
      let succCount = 0;

      result.map(siteStatus => {
        siteStatus.operations.map(opt => {
          if(opt.status != null && (opt.status === '200' || opt.status === 200) ) {
            succCount = succCount + 1;
          } else {
            failCount = failCount + 1;
          }
        })
      });

      this.statusChartChanged.next([failCount, succCount]);
  }
}


function random(options) {
  return options[Math.floor(Math.random() * options.length - 2) + 2];
}

const statusOptions = {
  opts: ['Access', 'Login', 'Process', 'Logout', 'Mp_import', 'Backup'],
  status: [200, 301, 404, 500, 'PENDING'],
};

const siteList = [
  {
    "Status": "200",
    "URL": "https://cca-uat.guidingcare.com/Portal/Account/Login?",
    "operations": [
      {
        "Name": "Login",
        "runtime": "2019-01-04 19:51:51",
        "status": 200
      },
      {
        "Name": "Access",
        "runtime": "2019-01-04 19:51:51",
        "status": 200
      }
    ],
    "website": "CMP-UAT"
  },
  {
    "Status": "UNREACHABLE",
    "URL": "https://www.cmpprod.com",
    "operations": [
      {
        "Name": "Login",
        "runtime": "2019-01-04 19:51:51",
        "status": "UNREACHABLE"
      },
      {
        "Name": "Access",
        "runtime": "2019-01-04 19:51:51",
        "status": "UNREACHABLE"
      }
    ],
    "website": "CMP-Prod"
  }
];