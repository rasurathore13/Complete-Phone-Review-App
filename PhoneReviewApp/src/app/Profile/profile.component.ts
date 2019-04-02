import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { User } from './User';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit
{
  submitButtonDisabled = false;
  isUserLoggedIn = false;
  user: User;

  constructor(private profileService: ProfileService, private router: Router) {
    if (localStorage.getItem('JWTAccessToken')) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
      this.router.navigate(['/Home']);
    }
  }

  ngOnInit() {
    if (this.isUserLoggedIn) {
      this.profileService.getUser().subscribe(response => {
        this.user = JSON.parse(JSON.stringify(response)) as User;

      },
      error => alert('There seems to be an error with you account. Try again later'));
    }
  }

  saveProfile() {
    this.submitButtonDisabled = false;
    this.profileService.submitUserDetails(this.user).subscribe(response => {
      alert('Your details were Updated successfully');
    },
    error => {
      alert(error.error.text);
    });
  }
}
