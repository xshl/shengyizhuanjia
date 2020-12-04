import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { User } from './../../../shared/class/user';
import { SettingService } from './../setting.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { PassportServiceService } from '../../passport/shared/passport-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(private router: Router,
              private toastController: ToastController,
              private passportService: PassportServiceService,
              private settingService: SettingService,
              private outlet: IonRouterOutlet,
              private localStorageService: LocalStorageService) {
  }

  changepassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit() {
  }

  async onSubmitPassword(form: NgForm) {
    if (form.valid) {
      // 已通过客户端验证
      let toast: any;
      toast = await this.toastController.create({
        duration: 3000
      });
      const user = this.passportService.getCurrentUser();
      this.passportService.checkPsd(user.phone, this.changepassword.oldPassword).then((res) => {
        console.log(res);
        if (res.success === true) {
          this.passportService.updatePsd(user.phone, this.changepassword.newPassword);
          toast.message = '密码修改成功';
          toast.present();
          this.outlet.pop(1);
          this.router.navigateByUrl('/setting');
        } else {
          toast.message = res.error.message;
          toast.present();
        }
      });
    }
  }

}
