import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPhones } from './Phones';
import { HomeService } from './home.service';
import { Router } from '@angular/router';

@Component({
  templateUrl : './home.component.html',
  providers: [HomeService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  numberOfRequestsToPhoneFetchAPI: number;
  phones: IPhones[];
  latestPhoneID: number;
  newReview: string;
  isLoadMorePhonesButtonClicked = false;

  constructor(private router: Router, private homeService: HomeService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    if (sessionStorage.getItem('numberOfRequestsToPhoneFetchAPI') === null) {
      this.numberOfRequestsToPhoneFetchAPI = 1;
      sessionStorage.setItem('numberOfRequestsToPhoneFetchAPI', JSON.stringify(this.numberOfRequestsToPhoneFetchAPI));
    } else {
      this.numberOfRequestsToPhoneFetchAPI = parseInt(sessionStorage.getItem('numberOfRequestsToPhoneFetchAPI'), 10);
      this.phones = JSON.parse(sessionStorage.getItem('phones')) as IPhones[];
      this.latestPhoneID = parseInt(sessionStorage.getItem('latestPhoneID'), 10);
    }
  }

  ngOnInit(): void {
    if (!this.phones) {
      this.homeService.getLatestPhoneID()
        .subscribe(
          response => {
          this.latestPhoneID = parseInt(JSON.stringify(response), 10);
          sessionStorage.setItem('latestPhoneID', JSON.stringify(this.latestPhoneID));
        },
          error => {
            console.log('There was an error in getting the latest Phone\'s ID.');
          },
          () => {
            this.homeService.getPhones(this.numberOfRequestsToPhoneFetchAPI, this.latestPhoneID)
            .subscribe(phoneList => {
              this.phones = phoneList as IPhones[];
              sessionStorage.setItem('phones', JSON.stringify(this.phones));
            });
          });
    }
  }

  loadMorePhones(): void {
    this.isLoadMorePhonesButtonClicked = true;
    this.homeService.getPhones(this.numberOfRequestsToPhoneFetchAPI + 1, this.latestPhoneID)
      .subscribe(phoneList => {
          const listOfPhones = phoneList as IPhones[];
          if (listOfPhones.length === 0) {
            window.alert('Sorry there are no more phones to display at the Moment');
            this.isLoadMorePhonesButtonClicked = false;
          } else {
            this.numberOfRequestsToPhoneFetchAPI++;
            sessionStorage.setItem('numberOfRequestsToPhoneFetchAPI', JSON.stringify(this.numberOfRequestsToPhoneFetchAPI));
            for (let i = 0; i < listOfPhones.length; i++) {
              this.phones.push(phoneList[i]);
            }
            sessionStorage.setItem('phones', JSON.stringify(this.phones));
            this.isLoadMorePhonesButtonClicked = false;
          }
        });
  }

  ngOnDestroy() {
  }

}
