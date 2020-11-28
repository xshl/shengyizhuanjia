import { PassportServiceService } from './../passport/shared/passport-service.service';
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
              private router: Router,
              private passportService: PassportServiceService) { }

  ngOnInit() {
  }
  onSlideWillChange(event: Event) {
    console.log(event);
    this.slides.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }

  onSkip(){
    const currentLogin = this.localStorageService.get('CurrentLogin', []);
    const userList = this.localStorageService.get('UserList', []);
    if (userList.length === 0){
      this.router.navigateByUrl('passport/signup');
    } else if (currentLogin.length !== 0) {
      const loginTime = new Date(currentLogin.loginTime);
      const nowTime = new Date();
      if (loginTime.getTime() + 5 * 24 * 3600 * 1000 >= nowTime.getTime()) {
        this.passportService.updateLoginTime();
        this.router.navigateByUrl('tabs/home');
      } else {
        this.localStorageService.set('CurrentLogin', []);
        this.router.navigateByUrl('/passport/login');
      }
    } else {
      this.router.navigateByUrl('/passport/login');
    }
  }
}
export const APP_KEY = 'App';
