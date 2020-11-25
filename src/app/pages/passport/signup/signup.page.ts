import { AlertController, IonRouterOutlet, IonSlides, ToastController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Signup } from './signup';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PassportServiceService } from '../shared/passport-service.service';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationCodeServiceService } from '../shared/authentication-code-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private authenticationCodeServiceService: AuthenticationCodeServiceService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private passportService: PassportServiceService,
              private toastController: ToastController,
              protected appc: AppComponent,
              private alertController: AlertController,
              private outlet: IonRouterOutlet) { }

  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  showSkip = true;
  slideIndex = 0;
  clickSendSMS = true;
  clickCodeBtn = false;
  clickDetailBtn = false;
  timer = null;
  timer2 = null;
  second = 60;
  timerTxt = '获取验证码';
  secondTxt = '5';
  smsCode = '';
  params = {};
  second2 = 5;
  codetimes = 0;
  // 用于判断收集号
  submited = false;
  phoneValid = false;  // 电话是否已经被注册

  @ViewChild('signupSlides', {static: true}) signupSlides: IonSlides;

  ngOnInit() {
    this.signupSlides.lockSwipes(true);
  }

  onNext() {
    this.signupSlides.lockSwipes(false);
    this.signupSlides.slideNext();
    this.slideIndex ++;
    this.signupSlides.lockSwipes(true);
  }

  onPrevious() {
    this.signupSlides.lockSwipes(false);
    this.signupSlides.slidePrev();
    this.slideIndex --;
    this.signupSlides.lockSwipes(true);
  }

  /*
   * 提交电话号码表单
   * @param {NgForm} form 电话号码表单
   * @memberof SignupPage
   */
  async onSubmitPhone(form: NgForm) {
    let toast: any;
    toast = await this.toastController.create({
        duration: 3000
    });
    if (form.valid) {
      // 已通过客户端验证
      this.passportService.isUniquePhone(this.signup).then((res) => {
        if (res.success === true){
          this.onNext();
        } else {
          console.log('添加失败');
          this.alertController.create({
            header: '提示',
            buttons: ['确定']
          }).then((alert) => {
            alert.message = res.error.message;
            alert.present();
          });
        }
      });
    }
  }

  /*
   * 提交验证码表单
   * @param {NgForm} form 验证码表单
   * @memberof SignupPage
   */
  onSubmitCode(form: NgForm) {
    this.clickCodeBtn = true;
    if (form.valid){
      // 已通过客户端验证
      console.log(form);
      this.signup.code = form.value.code;
      if (this.onValidateCode()){
        this.onNext();
      }
      console.log(this.signup.code);
    }
  }

  /*
   * 提交店铺详细信息表单
   * @param {NgForm} form 店铺详细信息表单
   * @memberof SignupPage
   */
  async onSubmitDetail(form: NgForm) {
    let toast: any;
    toast = await this.toastController.create({
        duration: 3000
    });
    this.clickDetailBtn = true;
    if (form.valid){
      // 已通过客户端验证
      console.log(form);
      this.signup.shopName = form.value.shopName;
      this.signup.email = form.value.email;
      this.signup.password = form.value.password;
      this.signup.confirmPassword = form.value.confirmPassword;

      if (this.onConfirmPassword()){
        this.passportService.addUser(this.signup).then((res) => {
          if (res.success === true){
            this.onNext();
          } else {
            console.log('添加失败');
            this.alertController.create({
              header: '提示',
              buttons: ['确定']
            }).then((alert) => {
              alert.message = res.error.message;
              alert.present();
            });
          }
        });
      }
    }
  }

  /*
   * 登录
   * @memberof SignupPage
   */
  onLogin() {
    this.outlet.pop(1);
    this.router.navigateByUrl('/tabs/home');
  }

  /*
   * 验证密码是否一致
   * @return {*}  {boolean} 是否一致
   * @memberof SignupPage
   */
  onConfirmPassword(): boolean{
    return this.signup.password === this.signup.confirmPassword;
  }

  /*
   * 发送验证码
   * @memberof SignupPage
   */
  onSendSMS() {
    this.clickSendSMS = false;
    this.smsCode = this.authenticationCodeServiceService.createCode(4);
    // this.authenticationCodeServiceService.sendSms(this.signup.phone);
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

  /*
   * 验证验证码是否正确
   * @return {*}  {boolean} 验证码是否正确
   * @memberof SignupPage
   */
  onValidateCode(): boolean{
    return this.authenticationCodeServiceService.validate(String(this.signup.code));
  }

}
