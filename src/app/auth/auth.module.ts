import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  exports: [
  ],
  declarations: [
    SignupComponent, 
    LoginComponent
  ],
  providers: [
  ]
})
export class AuthModule { }
