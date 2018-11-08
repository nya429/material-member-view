import { MembersComponent } from './members/members.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './navigation/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'members', component: MembersComponent},
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