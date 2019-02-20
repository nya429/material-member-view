import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { SiteStatusChartComponent } from './site-status-chart/site-status-chart.component';
import { ReportService } from './report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatProgressBarModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  declarations: [ReportComponent, SiteStatusChartComponent, ],
  providers:[ReportService]
})
export class ReportModule { }
