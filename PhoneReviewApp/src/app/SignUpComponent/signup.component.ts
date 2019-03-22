import { Component } from '@angular/core';
import { SignupService } from './signup.service';
import { NgForm } from '@angular/forms';
import { LoginService } from '../LogInComponent/login.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService, LoginService]
})
export class SignupComponent {
  email: string;
  password: string;
  confirmPassword: string;
  isAUserLoggedIn: Boolean;

  constructor(private router: Router, private signupService: SignupService, private loginService: LoginService) {
    if (localStorage.getItem('JWTAccessToken')) {
      this.isAUserLoggedIn = true;
    } else {
      this.isAUserLoggedIn = false;
    }
  }

  signUp(signupForm: NgForm) {
    if(signupForm.valid) {
      if(signupForm.value.password !== signupForm.value.confirmPassword) {
        alert('The Passwords Does not match. Please Check and try again.');
      } else {
        if(signupForm.value.password.length < 8) {
          alert('The password Needs to be atlest 8 charaters long.');
        } else {
          const regexp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
          if(regexp.test(signupForm.value.email)) {
            this.signupService.signupUser(signupForm).subscribe(response => {
              const user_ID = JSON.parse(JSON.stringify(response)).user_ID;
              this.loginService.loginUser(signupForm)
                .subscribe(response2 => {
                  let JWTAccessToken = JSON.stringify(response2);
                  localStorage.setItem('JWTAccessToken', JWTAccessToken.substring(1, JWTAccessToken.length - 1));
                  this.signupService.createUser(signupForm, user_ID).subscribe(response3 => {
                    alert('You are now registered and are eligible to make reviews');
                    window.location.reload();
                    this.router.navigate(['/Home']);
                  },
                  error => alert(error.error));
                },
                error => alert('Possibly you were registered. Please try logging In separately'));
            },
            error => {
              alert(JSON.stringify(error.error));
            });
          } else {
            alert('You need to enter a valid Email Address');
          }
        }
      }
    } else {
      alert('You need to enter all the feilds');
    }
  }
}
