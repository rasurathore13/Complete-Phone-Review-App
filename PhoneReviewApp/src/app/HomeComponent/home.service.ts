import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPhones } from './Phones';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {
  authenticationServer = 'https://authenticationapiforphonereviewapp.azurewebsites.net';
  appServer = 'https://apiforphonereviewapp.azurewebsites.net';
  constructor(private http: HttpClient) {  }

  getPhones(numberOfRequestsToPhoneFetchAPI: number, latestPhoneID: number): Observable<object> {
    return this.http.get(this.appServer + '/api/FetchPhones?LatestPhoneID=' + latestPhoneID +
                         '&Number=' + numberOfRequestsToPhoneFetchAPI);
  }

  getLatestPhoneID(): Observable<object> {
    return this.http.get(this.appServer + '/api/FetchPhones/GetLatestPhoneID');
  }
}
