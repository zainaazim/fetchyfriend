import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import * as handTrack from 'handtrackjs';
import { PredictionEvent } from '../prediction-event';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  @Output() onPrediction = new EventEmitter<PredictionEvent>();
  @ViewChild('htvideo') video!: ElementRef;
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

  constructor(private router: Router, private alertController: AlertController) {
  }

  ngOnInit(): void {
    this.presentFirstAlert();
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
          // Navigate to the /selection route when an open hand is detected
          this.router.navigate(['/selection']);
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

  async presentFirstAlert() {
    const alert = await this.alertController.create({
      header: 'Welcome!',
      subHeader: 'Loading HandTracking',
      message: 'Please wait for the next alert, which will assist you with handtracking.',

    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 5000);
  }

  async presentHandTrackAlert() {
    const alert = await this.alertController.create({
      header: 'HandTrack is Now Available',
      message: 'Please refer to the "i" button in the bottom right corner for information on gestures. Click anywhere to continue.',

    });

    await alert.present();
  }

  async presentInformationAlert() {
    const alert = await this.alertController.create({
      header: 'Gestures',
      message: 'Use "One Hand Open" to move to the next page.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
