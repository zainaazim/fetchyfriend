import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentFeedAlert() {
    const alert = await this.alertController.create({
      header: '[insert name here] has been fed.',
      message: "Good job. You're a great owner!",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = "../assets/food_brown.png";
    }

  }

  async presentWashAlert() {
    const alert = await this.alertController.create({
      header: '[insert name here] has been washed.',
      message: "Awww, he's not too happy!",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = "../assets/wash_brown.png";
    }

  }

  async presentPlayAlert() {
    const alert = await this.alertController.create({
      header: "You've tossed a ball to [insert name here].",
      message: "[insert name here] loves fetch. Good job!",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = "../assets/ball_brown.png";
    }

  }

  async presentPetAlert() {
    const alert = await this.alertController.create({
      header: "You've petted [insert name here].",
      message: "Great job! Your pet feels loved.",
      buttons: ['wee!']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = "../assets/heart_brown.png";
    }

  }

  //might change this so the sad dog pic comes up first, and alert pops up after a few second delay
  async presentendGameAlert() {
    const alert = await this.alertController.create({
      header: 'Ending Game',
      message: "Select 'Cancel' to keep playing.",
      buttons: ['Cancel', 'Ok']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    const imgElement = document.getElementById("dog") as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = "../assets/sad_brown.png";
    }

  }
}
