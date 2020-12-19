import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, IonRouterOutlet } from '@ionic/angular';
import { AuthenticationCodeServiceService } from '../shared/authentication-code-service.service';
import { PassportServiceService } from '../shared/passport-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(private passportService: PassportServiceService,
              private authenticationCodeServiceService: AuthenticationCodeServiceService,
              private router: Router,
              private outlet: IonRouterOutlet) { }

  forgotpassword = {
    phoneOrEmail : '',
    password: '',
    confirmPassword: '',
    code: '',
  };

  phoneOrEmailValid = false;
  clickCodeBtn = false;
  clickSendSMS = true;
  smsCode = '';
  codetimes = 0;
  timerTxt = '获取验证码';
  timer = null;
  second = 60;
  secondTxt = '5';
  second2 = 5;
  timer2 = null;

  @ViewChild('forgotPasswordSlides', {static: true}) forgotPasswordSlides: IonSlides;
  ngOnInit() {
    this.forgotPasswordSlides.lockSwipes(true);
  }

  onNext(){
    this.forgotPasswordSlides.lockSwipes(false);
    this.forgotPasswordSlides.slideNext();
    this.forgotPasswordSlides.lockSwipes(true);
  }
  onPrevious() {
    this.forgotPasswordSlides.lockSwipes(false);
    this.forgotPasswordSlides.slidePrev();
    this.forgotPasswordSlides.lockSwipes(true);
  }

  onSubmitPhoneOrEmail(form: NgForm) {
    this.onNext();
  }

  onSubmitCode(form: NgForm) {
    this.onNext();
  }

  onSubmitPassword(form: NgForm) {
    this.onNext();
    this.timer2 = setInterval(() => {
      // console.log(this.second);
       if (this.second2 === 0){
         this.secondTxt = '5';
         this.second2 = 5;
         clearInterval(this.timer2);
         // 重置signup
         this.forgotpassword.password = '';
         this.forgotpassword.confirmPassword = '';
         this.forgotpassword.phoneOrEmail = '';
        // 重置verifyCode
         this.smsCode = '';
         this.codetimes = 0;
         this.outlet.pop(1);
         this.router.navigateByUrl('passport/login');
       } else {
         this.secondTxt = `${this.second2}`;
       }
       this.second2 --;
     }, 1000);
  }

  onSendSMS() {
    this.clickSendSMS = false;
    this.smsCode = this.authenticationCodeServiceService.createCode(4);
    console.log(this.smsCode);
    this.codetimes ++;
    if (this.codetimes > 3){
      this.timerTxt = '禁止申请';
    } else {
      this.timer = setInterval(() => {
        // console.log(this.second);
         if (this.second === 0){
           this.timerTxt = '重新发送';
           this.second = 60;
           this.clickSendSMS = true;
           clearInterval(this.timer);
         } else {
           this.timerTxt = `${this.second}秒`;
         }
         this.second --;
       }, 1000);
    }
  }
}
