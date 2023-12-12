import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import * as handTrack from 'handtrackjs';
import { PredictionEvent } from '../prediction-event';
import { Router } from '@angular/router';
import { DogService } from '../dog.service';
import { AlertController, IonSelect } from '@ionic/angular';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  @Output() onPrediction = new EventEmitter<PredictionEvent>();
  @ViewChild('htvideo') video!: ElementRef;
  @ViewChild('mySelect') mySelect!: IonSelect;
  SAMPLERATE: number = 2000; 
  
  detectedGesture: string = "None";
  width: string = "400";
  height: string = "400";

  private model: any = null;
  private runInterval: any = null;

  //handTracker model
  private modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
  };

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

    handTrack.load(this.modelParams).then((lmodel: any) => {
      this.model = lmodel;
      console.log("loaded");
      this.startDetection();
    });
  }

  ngOnDestroy(): void {
    this.model.dispose();
  }

  startVideo(): Promise<any> {
    return handTrack.startVideo(this.video.nativeElement).then(function (status: any) {
      return status;
    }, (err: any) => { return err; });
  }

  startDetection() {
    this.startVideo().then(() => {
      // The default size set in the library is 20px. Change here or use styling
      // to hide if video is not desired in UI.
      this.video.nativeElement.style.height = "0px";

      console.log("starting predictions");
      this.presentHandTrackAlert();
      this.runInterval = setInterval(() => {
        this.runDetection();
      }, this.SAMPLERATE);
    }, (err: any) => { console.log(err); });
  }

  stopDetection() {
    console.log("stopping predictions");
    clearInterval(this.runInterval);
    handTrack.stopVideo(this.video.nativeElement);
  }

  runDetection() {
    if (this.model != null) {
      let predictions = this.model.detect(this.video.nativeElement).then((predictions: any) => {
        if (predictions.length <= 0) return;
        let openhands = 0;
        let closedhands = 0;
        let pointing = 0;
        let pinching = 0;
        for (let p of predictions) {
          // uncomment to view label and position data
          console.log(p.label + " at X: " + p.bbox[0] + ", Y: " + p.bbox[1] + " at X: " + p.bbox[2] + ", Y: " + p.bbox[3]);

          if (p.label == 'open') openhands++;
          if (p.label == 'closed') closedhands++;
          if (p.label == 'point') pointing++;
          if (p.label == 'pinch') pinching++;

        }

        // These are just a few options! What about one hand open and one hand closed!?

        if (openhands > 1) this.detectedGesture = "Two Open Hands";
        else if (openhands == 1) this.detectedGesture = "Open Hand";

        if (closedhands > 1) this.detectedGesture = "Two Closed Hands";
        else if (closedhands == 1) this.detectedGesture = "Closed Hand";

        if (pointing > 1) this.detectedGesture = "Two Hands Pointing";
        else if (pointing == 1) this.detectedGesture = "Hand Pointing";

        if (pinching > 1) this.detectedGesture = "Two Hands Pinching";
        else if (pinching == 1) this.detectedGesture = "Hand Pinching";

        if (openhands == 0 && closedhands == 0 && pointing == 0 && pinching == 0)
          this.detectedGesture = "None";

        this.onPrediction.emit(new PredictionEvent(this.detectedGesture));

        if (this.detectedGesture === 'Open Hand') {

          this.presentFeedAlert();
        }

        else if (this.detectedGesture === 'Closed Hand') {

          this.presentPlayAlert();
        }

        else if (this.detectedGesture === 'Hand Pointing') {

          this.presentPetAlert();
        }

        else if (this.detectedGesture === "Two Open Hands") {

          this.presentWashAlert();
        }

        else if (this.detectedGesture === 'Two Closed Hands') {

          this.sadDog();
          this.stopDetection();
        }


      }, (err: any) => {
        console.log("ERROR")
        console.log(err)
      });
    }
    else {
      console.log("no model")
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
      nameLabel.style.backgroundColor = 'rgba(160, 191, 220, 0.326)';
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

  async presentHandTrackAlert() {
    const alert = await this.alertController.create({
      header: 'HandTrack has Begun',
      message: 'Please refer to the "i" button in the bottom right corner for information on gestures. Click anywhere to continue.',

    });

    await alert.present();
  }

  async presentInformationAlert() {
    const alert = await this.alertController.create({
      header: 'Gestures',
      message: 'One Hand Open: Feed, Two Hands Open: Wash, One Hand Closed: Play, One Hand Pointing: Pet, Two Hands Closed: End Game',
      buttons: ['OK']
    });

    await alert.present();
  }


}
