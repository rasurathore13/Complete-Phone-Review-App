import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent {

  email: string;
  password: string;
  isAUserLoggedIn: boolean;

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) {
    if (localStorage.getItem('JWTAccessToken')) {
      this.isAUserLoggedIn = true;
    } else {
      this.isAUserLoggedIn = false;
    }
  }

  logIn(loginForm: NgForm) {
    if(loginForm.value.email.length === 0 || loginForm.value.password.length === 0) {
      alert('Both the fields are mandatory');
    } else {
      this.loginService.loginUser(loginForm)
      .subscribe(response => {
        let JWTAccessToken = JSON.stringify(response);
        localStorage.setItem('JWTAccessToken', JWTAccessToken.substring(1, JWTAccessToken.length - 1));
        window.location.reload();
        this.router.navigate(['/Home']);
      },
      error => {
        alert(error.error);
      });
    }
  }
}
