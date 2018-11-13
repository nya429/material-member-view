import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { resolve } from 'url';

@Injectable()
export class AuthService {
    constructor(private httpClient: HttpClient,
                private router: Router) { }

    token = null;
    signinStateChanged = new Subject<string> ();

    signupUser(signupForm) {
        return this.httpClient.post(`http://localhost:5000/register`, signupForm, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                    this.token = result['access_token'];
                    this.signinStateChanged.next('authed');
              }, (err: HttpErrorResponse)  => {
                     console.error(err);
                     this.token = null;
                    this.signinStateChanged.next('fail');
              }
          );
    }

    signinUser(signupForm) {
        return this.httpClient.post(`http://localhost:5000/auth`, signupForm, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                //   this.router.navigate(['/members']);
                  this.token = result['access_token'];
                  this.signinStateChanged.next('authed');
              }, (err: HttpErrorResponse)  => {
                console.error(err);
                this.token = null;
                this.signinStateChanged.next('fail');
              }
          );
    }

    logoutUser() {
        this.token = null;
        this.router.navigate(['/login']);
    }

    getToken(): Promise<string> {
        return null;
    }

    isAuthenticated() {
        // return true;
        return this.token !== null;

    }
    
    changeSigninScale() {
        this.signinStateChanged.next('fail');
    }
}