import { ProcessModule } from './process/process.module';
import { AuthService } from './auth/auth.service';
import { MembersModule } from './members/members.module';
import { HomeComponent } from './navigation/home/home.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NavigationModule } from './navigation/navigation.module';
import { SignupComponent } from './auth/signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth/auth-guard.service';
import { ReportModule } from './report/report.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
  //   NavigationModule,
    AuthModule,
    MembersModule,
    ReportModule,
    ProcessModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
