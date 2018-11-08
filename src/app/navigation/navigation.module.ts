import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
     HeaderComponent,
     SidenavListComponent,
     HomeComponent
    ],
  imports: [
    CommonModule,
    MaterialModule
  ], exports:[
    HeaderComponent,
    SidenavListComponent,
    HomeComponent
  ]
})
export class NavigationModule { }
