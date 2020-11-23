import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class GuidePage implements OnInit {
  showSkip = true;
  @ViewChild('slides', {static: false}) slides: IonSlides;
  constructor(private localStorageService: LocalStorageService,
              private router: Router) { }

  ngOnInit() {
  }
  onSlideWillChange(event: Event) {
    console.log(event);
    this.slides.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }

  onSkip(){
    this.router.navigateByUrl('/passport/signup');
  }
}
<<<<<<< HEAD
=======

>>>>>>> bdf8a335c2cc683d342f14bf2e4bedd6e015aabc
export const APP_KEY = 'App';
