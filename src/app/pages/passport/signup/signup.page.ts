import { IonSlides } from '@ionic/angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Signup } from './signup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements AfterViewInit {

  constructor() { }

  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  slideIndex = 0;

  @ViewChild('signupSlides') signupSlides: IonSlides;

  ngAfterViewInit() {
    this.signupSlides.lockSwipeToNext(true);
  }

  onSlideDidChange() {
    this.signupSlides.getActiveIndex().then((n) => {
      this.slideIndex = n;
    });
  }

  onNext() {
    this.signupSlides.slideNext();
  }

  onPrevious() {
    this.signupSlides.slidePrev();
  }

}
