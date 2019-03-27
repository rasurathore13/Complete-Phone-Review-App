import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {
  authenticationServer = 'https://authenticationapiforphonereviewapp.azurewebsites.net';
  appServer = 'https://apiforphonereviewapp.azurewebsites.net';
  constructor(private http: HttpClient) { }

  searchPhone(searchPhrase: string): Observable<object> {
    return this.http
          .get('https://search-phone-ayajxcgg744cbywfmvzjxd6hhm.ap-south-1.es.amazonaws.com/phone_list/phones/_search?q=' + searchPhrase);
  }

  getPhonesFromDatabase(idsOfSearchResult: number[]): Observable<object> {
    return this.http.post(this.appServer + '/api/FetchPhones/GetSearchedListOfPhones', { idsOfSearchResults : idsOfSearchResult });
  }
}
