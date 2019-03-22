import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPhones } from './Phones';

@Component({
  templateUrl: './search.component.html',
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  searchValue: string;
  idsOfSearchResults: number[] = [];
  isSearchValid = true;
  listOfSearchedPhones: IPhones[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private searchService: SearchService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => this.searchValue = param.get('searchPhrase'));

    this.searchService.searchPhone(this.searchValue).subscribe(response => {
      const arrayOfResults = JSON.parse(JSON.stringify(response)).hits.hits;
      if (arrayOfResults.length <= 0) {
        this.isSearchValid = false;
      } else {
        this.isSearchValid = true;

        for (const obj of arrayOfResults) {
          this.idsOfSearchResults.push(obj._source.Phone_ID);
        }
        this.searchService.getPhonesFromDatabase(this.idsOfSearchResults).subscribe(x => this.listOfSearchedPhones = x as IPhones[]);
      }
    });
  }
}
