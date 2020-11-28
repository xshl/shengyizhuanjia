import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PassportServiceService } from './../shared/passport-service.service';
import { ToastController, AlertController, IonRouterOutlet } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = '';  // 视图模型的属性账号，双向绑定
  password = '';  // 视图模型的属性密码，双向绑定

  constructor(private toastController: ToastController,
              private alertController: AlertController,
              private passportService: PassportServiceService,
              private outlet: IonRouterOutlet,
              private router: Router,
              private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.username = this.passportService.getHistoryLogin();
  }

  /*
   * 登录
   * @param {NgForm} form 登录表单
   * @memberof LoginPage
   */
  async onLogin(form: NgForm) {
    let toast: any;
    // 判断表单验证是否正确
    toast = await this.toastController.create({
      duration: 3000
    });
    if (this.username === '') {
      toast.message = '请输入您的手机号码或邮箱';
      toast.present();
    } else if (this.password === '' ){
      toast.message = '请输入您的密码';
      toast.present();
    } else {
      this.passportService.login(this.username, this.password).then((res) => {
        if (res.success) {
          toast.message = '登录成功';
          toast.present();
          this.outlet.pop(1);
          this.router.navigateByUrl('/tabs/home');
        } else {
          this.alertController.create({
            header: '警告',
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
