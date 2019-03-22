import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './HeaderComponent/header.component';
import { HomeComponent } from './HomeComponent/home.component';
import { PageNotFoundComponent } from './PageNotFoundComponent/pageNotFound.component';
import { LoginComponent } from './LogInComponent/login.component';
import { SignupComponent } from './SignUpComponent/signup.component';
import { PhoneViewComponent } from './PhoneViewComponent/phoneview.component';
import { FooterComponent } from './FooterComponent/footer.component';
import { SearchComponent } from './SearchComponent/search.component';
import { PhoneAddComponent } from './PhoneAddComponent/phoneadd.component';
import { ProfileComponent } from './Profile/profile.component';

const AppRoutes: Routes = [
  { path : '', component : HomeComponent },
  { path : 'Home', component : HomeComponent },
  { path : 'Login', component : LoginComponent },
  { path : 'Signup', component : SignupComponent },
  { path : 'Phone/:phoneID', component : PhoneViewComponent},
  { path : 'Search/:searchPhrase', component : SearchComponent },
  { path : 'AddPhone', component : PhoneAddComponent },
  { path : 'Profile', component : ProfileComponent },
  { path : '**', component : PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent, HeaderComponent, HomeComponent, PageNotFoundComponent, LoginComponent, SignupComponent,
    PhoneViewComponent, FooterComponent, SearchComponent, PhoneAddComponent, ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
