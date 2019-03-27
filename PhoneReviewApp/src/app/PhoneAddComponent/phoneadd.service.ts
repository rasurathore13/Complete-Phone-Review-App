import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

class phone {
  Phone_Name: string;
  Phone_Front_Camera: number;
  Phone_Back_Camera: number;
  Phone_Screen: number;
  Phone_Battery: number;
  Phone_Speaker: number;
  Phone_Date_Of_Release: Date;
  Phone_Image_Link: string;
  Phone_Details: string;
}

@Injectable()
export class PhoneAddService{
  authenticationServer = 'https://authenticationapiforphonereviewapp.azurewebsites.net';
  appServer = 'https://apiforphonereviewapp.azurewebsites.net';
  constructor(private http: HttpClient) { }

  isUserAdmin() {
    localStorage.getItem('JWTAccessToken');
    const headers = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + localStorage.getItem('JWTAccessToken'),
        'Content-Type':  'application/json',
      })
    };
    return this.http.get(this.appServer + '/api/FetchUser/IsUserAdmin', headers);
    }

    addPhoneToSql(addPhoneForm: NgForm): Observable<object> {
      const header = {
        headers: new HttpHeaders({
          Authorization : 'Bearer ' + localStorage.getItem('JWTAccessToken'),
          'Content-Type':  'application/json'
        })
      };
      const body = {
        Phone_Name: addPhoneForm.value.phoneName,
        Phone_Front_Camera: addPhoneForm.value.phoneFrontCamera,
        Phone_Back_Camera: addPhoneForm.value.phoneBackCamera,
        Phone_Screen: addPhoneForm.value.phoneScreen,
        Phone_Battery: addPhoneForm.value.phoneBattery,
        Phone_Date_Of_Release: addPhoneForm.value.phoneDate,
        Phone_Image_Link: addPhoneForm.value.phoneImageLink,
        Phone_Details: addPhoneForm.value.phoneDetails,
      };
      return this.http.post(this.appServer + '/api/FetchPhones/AddPhone', body, header);
    }

    addPhoneToElasticSearch(phone_Details): Observable<object> {
      const header = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http
      .post('https://search-phone-ayajxcgg744cbywfmvzjxd6hhm.ap-south-1.es.amazonaws.com/phone_list/phones', phone_Details, header);
    }

  }
