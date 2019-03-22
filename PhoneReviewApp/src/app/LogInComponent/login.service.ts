import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

class Credentials {
  Email: string;
  Password: string;
}

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  loginUser(loginForm: NgForm): Observable<object> {
    const headers = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json'
      })
    };
    const body = new Credentials();
    body.Email = loginForm.value.email;
    body.Password = loginForm.value.password;
    return this.http.post('http://localhost:20485/api/JWT/Token',
    body, headers);
  }
}
