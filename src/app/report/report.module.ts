import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { SiteStatusChartComponent } from './site-status-chart/site-status-chart.component';
import { ReportService } from './report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [ReportComponent, SiteStatusChartComponent],
  providers:[ReportService]
})
export class ReportModule { }
