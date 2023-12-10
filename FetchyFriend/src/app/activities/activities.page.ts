import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DogService } from '../dog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  private dogType: string;
  dogName: string = "name";

  constructor(private alertController: AlertController, private dogService: DogService, private router: Router) { 

    this.dogType = "reg";
  }

  ngOnInit() {
    this.presentNameAlert();
    this.getDogType();
    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_neutral.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_neutral.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_neutral.png";
    }
  }

  getDogType(){
    this.dogType = this.dogService.getDogType();
  }

  async presentFeedAlert() {
    const alert = await this.alertController.create({
      header: this.dogName + ' has been fed.',
      message: "Good job. You're a great owner!",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_feed.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_feed.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_feed.png";
    }

  }

  async presentWashAlert() {
    const alert = await this.alertController.create({
      header: this.dogName + ' has been washed.',
      message: "Awww, " + this.dogName + "'s not very happy!",
      buttons: ['uh oh!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_wash.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_wash.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_wash.png";
    }

  }

  async presentPlayAlert() {
    const alert = await this.alertController.create({
      header: "You've tossed a ball to " + this.dogName + ".",
      message: this.dogName + " loves fetch. Good job!",
      buttons: ['yay!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_play.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_play.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_play.png";
    }

  }

  async presentPetAlert() {
    const alert = await this.alertController.create({
      header: "You pet " + this.dogName + ".",
      message: "Great job! " + this.dogName + " feels loved.",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_pet.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_pet.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_pet.png";
    }

  }

  sadDog(){

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement && this.dogType === "reg") {
      imgElement.src = "../assets/reg_sad.png";
    }

    if (imgElement && this.dogType === "bw") {
      imgElement.src = "../assets/bw_sad.png";
    }

    if (imgElement && this.dogType === "brown") {
      imgElement.src = "../assets/brown_sad.png";
    }

    this.presentEndGameAlert();
  }

  //might change this so the sad dog pic comes up first, and alert pops up after a few second delay
  async presentEndGameAlert() {

    const delayTime = 1000;

    // Use setTimeout to create a delay
    setTimeout(async () => {
    const alert = await this.alertController.create({
      header: "End Game?",
      message: "Select 'Cancel' to continue playing.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Handle 'Cancel' button click
            console.log('Continue playing');
          }
        },
        {
          text: 'End Game',
          handler: () => {
            // Handle 'End Game' button click after a delay
              this.router.navigate(['/home']);
          }
        }
      ]
    });
  
    await alert.present();
  }, delayTime);
  }

  onNameChange(event: any) {
    this.dogName = event.detail.value;
    const nameLabel = document.getElementById("name") as HTMLImageElement | null;

    if (nameLabel && this.dogName) {
      nameLabel.innerText = this.dogName;
    }
  }

  async presentNameAlert() {
    const alert = await this.alertController.create({
      header: "Select a Name",
      message: 'Select a name using the dropdown below. The default is "name."',
      buttons: ['Ok']
    });

    await alert.present();

  }

}
