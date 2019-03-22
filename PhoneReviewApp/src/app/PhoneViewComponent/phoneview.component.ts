import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneViewService } from './phoneview.service';
import { IPhones } from './Phones';
import { Reviews } from './Reviews';
import { HttpResponse } from '@angular/common/http';

@Component({
  templateUrl: './phoneview.component.html',
  providers: [PhoneViewService],
  styleUrls: ['./phoneview.component.css'],
})
export class PhoneViewComponent implements OnInit {
  phoneID: number;
  phoneDetails: IPhones;
  isPhoneIDValid = true;
  phoneDetailList: string;
  listOfKeysOfDetails: string[];
  listOfGoodReviews: Reviews[] = [];
  listOfBadReviews: Reviews[] = [];
  listOfNeutralReviews: Reviews[] = [];
  totalBadReviews = 0;
  totalGoodReviews = 0;
  totalNeutralReviews = 0;
  isReviewSubmitted = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private phoneViewService: PhoneViewService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => this.phoneID = parseInt(param.get('phoneID'), 10));
    this.phoneViewService.getPhone(this.phoneID).subscribe(
      response => {
        if (response == null) {
          this.isPhoneIDValid = false;
        } else {
          this.phoneDetails = JSON.parse(JSON.stringify(response));
        }
      },
      error => {
        this.isPhoneIDValid = false;
      },
      () => {
        this.phoneViewService.getDetails(this.phoneDetails.phone_ID)
            .subscribe(response1 => {
              this.phoneDetailList = JSON.parse(JSON.stringify(response1)).hits.hits[0]._source;
              this.listOfKeysOfDetails = Object.keys(this.phoneDetailList);
              this.listOfKeysOfDetails.splice(0, 1);
            });
      });

    this.phoneViewService.getReviews(this.phoneID).subscribe(
      response => {
        const listOfReviews = response as Reviews[];
        for (const reviews of listOfReviews) {
          if (reviews.review_Sentiment === 0) {
            this.totalBadReviews++;
            this.listOfBadReviews.push(reviews);
          } else if (reviews.review_Sentiment === 1) {
            this.totalNeutralReviews++;
            this.listOfNeutralReviews.push(reviews);
          } else {
            this.totalGoodReviews++;
            this.listOfGoodReviews.push(reviews);
          }
        }
    });
  }

  arrayMaker(n: number) {
    return Array(n);
  }

  checkerForString(val: any) {
    if (typeof val === 'object') {
      return false;
    } else {
      return true;
    }
  }

  listOfKeysMaker(val: string) {
    return Object.keys(JSON.parse(JSON.stringify(val)));
  }

  submitReview(userReview: string) {
    if (!localStorage.getItem('JWTAccessToken')) {
      window.alert('You need to Log in first');
      this.router.navigate(['/Login']);
    } else {
      if (userReview.length === 0 || userReview.trim().length === 0) {
        window.alert('You need to enter a Review to Submit');
      } else {
        this.isReviewSubmitted = true;
        const regex = new RegExp(/\r?\n|\r/g);
        const newUserReview = userReview.replace(regex, ' ');
        this.phoneViewService.submitReview(newUserReview, this.phoneID).subscribe(
        (response) => {
          if (response['review_Sentiment'] === 0) {
            this.totalBadReviews++;
            this.listOfBadReviews.push(response as Reviews);
          } else if (response['review_Sentiment'] === 1) {
            this.totalNeutralReviews++;
            this.listOfNeutralReviews.push(response as Reviews);
          } else {
            this.totalGoodReviews++;
            this.listOfGoodReviews.push(response as Reviews);
          }
          this.isReviewSubmitted = false;
          window.alert('Your Review was sucessfully added.');
        },
        error => {
          window.alert('There was some error adding your Review. Please try asgain later');
          this.isReviewSubmitted = false;
        });
      }
    }

  }
}
