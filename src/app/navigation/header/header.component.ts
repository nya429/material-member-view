import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    window.confirm('Do you want to logout') ? this.authService.logoutUser() : null;
  }

  isAuth() {
    return this.authService.isAuthenticated();
  }
}
