import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './User';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) { }

  getUser(): Observable<object> {
    const header = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type': 'application/json'
      }
    };
    return this.http.get('http://localhost:18561/api/FetchUser/GetUserDetails', header);
  }

  submitUserDetails(user: User) {
    const header = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type': 'application/json'
      }
    };
    return this.http.post('http://localhost:18561/api/FetchUser/SubmitUserDetails', user, header);
  }
}
