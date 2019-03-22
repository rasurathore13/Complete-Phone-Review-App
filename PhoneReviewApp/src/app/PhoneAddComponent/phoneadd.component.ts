import { Component, OnInit } from '@angular/core';
import { PhoneAddService } from './phoneadd.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './phoneadd.component.html',
  providers: [PhoneAddService],
  styleUrls: ['./phoneadd.component.css']
})
export class PhoneAddComponent implements OnInit {
  isAUserLoggedIn: boolean;
  isUserAdmin: boolean;
  phoneName: string;
  phoneFrontCamera: number;
  phoneBackCamera: number;
  phoneScreen: number;
  phoneBattery: number;
  phoneSpeaker: number;
  phoneDate: number;
  phoneImageLink: string;
  phoneDetails: string;

  constructor(private http: HttpClient, private phoneAddService: PhoneAddService) {
    if (localStorage.getItem('JWTAccessToken')) {
      this.isAUserLoggedIn = true;
    } else {
      this.isAUserLoggedIn = false;
    }
  }

  ngOnInit() {
    if (this.isAUserLoggedIn) {
      this.phoneAddService.isUserAdmin().subscribe(response => {
        this.isUserAdmin = true;
      },
      error => console.log('Not an admin'));
    }
  }

  addPhone(addPhoneForm: NgForm) {
    const phone = addPhoneForm.value;
    console.log(phone);
    if (phone.phoneName !== null && phone.phoneFrontCamera !== null && phone.phoneBackCamera !== null
      && phone.phoneScreen !== null && phone.phoneDate !== null && phone.phoneBattery !== null
      && phone.phonespeaker !== null && phone.phoneImageLink !== null && phone.phoneDetails !== null) {
        this.phoneAddService.addPhoneToSql(addPhoneForm).subscribe(response => {
          let data = JSON.parse(JSON.stringify(response));
          let phone_Details = JSON.parse(data.phone_Details);
          phone_Details.Phone_ID = data.phone_ID;
          this.phoneAddService.addPhoneToElasticSearch(phone_Details).subscribe(response1 => {
            alert('The Phone was Successfully added');
          },
          error => alert('The Phone was added in database but not in ElasticSearch. So it is not searchable'));
          },
          error => console.log(error.error));
    } else {
      alert('All Fields are mandatory');
    }
  }
}
