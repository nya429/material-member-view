import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { SiteStatusChartComponent } from './site-status-chart/site-status-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ReportComponent, SiteStatusChartComponent]
})
export class ReportModule { }
