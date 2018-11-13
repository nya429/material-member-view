
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
                    if (this.authService.isAuthenticated()) {
                        console.log(state.url )
                        return state.url ==='/login' ? false : true;
                    } else {
                        this.authService.changeSigninScale();
                        this.router.navigate(['/login']);
                        return false;
                    }
    }
                
}