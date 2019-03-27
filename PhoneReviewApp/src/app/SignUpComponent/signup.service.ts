import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

class Credentials {
  Email: string;
  Password: string;
}

class User {
  User_ID: number;
  Email: string;
}

@Injectable()
export class SignupService {
  authenticationServer = 'https://authenticationapiforphonereviewapp.azurewebsites.net';
  appServer = 'https://apiforphonereviewapp.azurewebsites.net';
  constructor(private http: HttpClient) { }

  signupUser(signupForm: NgForm): Observable<object> {
    const headers = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const body = new Credentials();
    body.Email = signupForm.value.email;
    body.Password = signupForm.value.password;
    return this.http.post(this.authenticationServer + '/api/JWT/Register',
    body, headers);
  }

  createUser(signupForm: NgForm, id: number): Observable<object> {
    const user = new User();
    user.Email = signupForm.value.email;
    user.User_ID = id;
    const headers = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.appServer + '/api/FetchUser/CreateUser', user, headers);
  }

}
