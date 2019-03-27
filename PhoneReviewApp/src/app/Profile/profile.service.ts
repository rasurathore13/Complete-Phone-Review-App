import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './User';

@Injectable()
export class ProfileService {
  authenticationServer = 'https://authenticationapiforphonereviewapp.azurewebsites.net';
  appServer = 'https://apiforphonereviewapp.azurewebsites.net';
  constructor(private http: HttpClient) { }

  getUser(): Observable<object> {
    const header = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type': 'application/json'
      }
    };
    return this.http.get(this.appServer + '/api/FetchUser/GetUserDetails', header);
  }

  submitUserDetails(user: User) {
    const header = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type': 'application/json'
      }
    };
    return this.http.post(this.appServer + '/api/FetchUser/SubmitUserDetails', user, header);
  }
}
