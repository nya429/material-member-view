import { D3forceComponent } from './process/d3force/d3force.component';
import { ReportComponent } from './report/report.component';
import { MemebrDiffWrappeComponent } from './members/memebr-diff-wrappe/memebr-diff-wrappe.component';
import { MemebrListWrapperComponent } from './members/memebr-list-wrapper/memebr-list-wrapper.component';
import { AuthGuard } from './auth/auth-guard.service';
import { MembersComponent } from './members/members.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './navigation/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'reports', component: ReportComponent},
    {path: 'members', component: MembersComponent, canActivate: [AuthGuard],
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'cca'
        },
        {
            path: 'cca',
            component: MemebrListWrapperComponent,
            data: { state: 'cca' } 
        },
        {
            path: 'state',
            component: MemebrListWrapperComponent,
            data: { state: 'state' } 
        },
        {
            path: 'diff',
            component: MemebrDiffWrappeComponent,
            data: { state: 'diff' } 
        },
    ]},
    {path: 'process', component: D3forceComponent},
    { path: 'not-found',component: LoginComponent,
        data: {message: 'Page not Found'} },
    { path: '**', redirectTo: 'not-found' },
];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}