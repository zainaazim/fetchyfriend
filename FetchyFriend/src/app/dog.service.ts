import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  private dogType: string;
  constructor() { 
    this.dogType = 'reg';
  }

  setDogType(data: string){
    this.dogType = data;
  }

  getDogType(){
    return this.dogType;
  }
}
