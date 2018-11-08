import { AgePipe } from './age.pipe';
import { ClickOutsideDirective } from './click-outside.directive';
import { HttpClientModule } from '@angular/common/http';
import { MemberListService } from './member-list.service';
import { MembersComponent } from './members.component';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatGridListModule, MatTableModule, MatDividerModule, MatDatepickerModule, MatSelectModule, MatExpansionModule, MatSlideToggleModule, MatSortModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatListModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberListActionComponent } from './member-list-action/member-list-action.component';
import { MemberListFilterComponent } from './member-list-filter/member-list-filter.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { MemberListQuickFilterComponent } from './member-list-quick-filter/member-list-quick-filter.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatDatepickerModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  exports: [
  ],
  declarations: [
    AgePipe,
    MembersComponent,
    MemberListComponent,
    MemberListActionComponent,
    MemberListFilterComponent,
    TypeaheadComponent,
    ClickOutsideDirective,
    MemberListQuickFilterComponent
  ],
  providers: [
    MemberListService,
    ClickOutsideDirective
  ]
})
export class MembersModule { }
