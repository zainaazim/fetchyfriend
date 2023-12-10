import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DogService } from '../dog.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {

  constructor(private router: Router, private dogService: DogService) { }

  ngOnInit() {
  }

  setDogTypeRegular() {
    this.dogService.setDogType('reg');
    this.navigateToActivitiesPage();
  }

  setDogTypeBW() {
    this.dogService.setDogType('bw');
    this.navigateToActivitiesPage();
  }

  setDogTypeBrown() {
    this.dogService.setDogType('brown');
    this.navigateToActivitiesPage();
  }

  navigateToActivitiesPage() {
    this.router.navigate(['/activities']);
  }

}
