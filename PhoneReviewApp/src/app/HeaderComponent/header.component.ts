import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  IsUserLoggedIn: boolean;
  email = 'hello there';
  JWTAccessToken: string;
  searchKey: string;

  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.JWTAccessToken = localStorage.getItem('JWTAccessToken');
    if (this.JWTAccessToken == null) {
      this.IsUserLoggedIn = false;
    } else {
      this.IsUserLoggedIn = true;
      this.email = localStorage.getItem('email');
    }
  }

  logIn() {
    this.router.navigate(['/Login']);
  }

  logOut() {
    localStorage.clear();
    window.location.reload();
  }

  signUp() {
    this.router.navigate(['/Signup']);
  }

  search() {
    this.router.navigate(['/Search/' + this.searchKey]);
  }

}
