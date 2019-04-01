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
  isSubmitButtonClicked = false;

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) {
    if (localStorage.getItem('JWTAccessToken')) {
      this.isAUserLoggedIn = true;
      this.router.navigate(['/Home']);
    } else {
      this.isAUserLoggedIn = false;
    }
  }

  logIn(loginForm: NgForm) {
    this.isSubmitButtonClicked = true;
    if (loginForm.valid) {
      if(loginForm.value.email.length === 0 || loginForm.value.password.length === 0) {
        alert('Both the fields are mandatory');
        this.isSubmitButtonClicked = false;
      } else {
        this.loginService.loginUser(loginForm)
        .subscribe(response => {
          let JWTAccessToken = JSON.stringify(response);
          localStorage.setItem('JWTAccessToken', JWTAccessToken.substring(1, JWTAccessToken.length - 1));
          window.location.reload();
        },
        error => {
          alert(JSON.stringify(error.error));
          this.isSubmitButtonClicked = false;
        });
      }
    } else {
      this.isSubmitButtonClicked = false;
    }
  }
}
