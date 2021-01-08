import { AlertController, IonRouterOutlet, NavController } from '@ionic/angular';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  version = '';
  constructor(private localstorageService: LocalStorageService,
              private outlet: IonRouterOutlet,
              private alertController: AlertController,
              private router: Router,
              private nav: NavController,
              private navCtrl: NavController) { }

  ngOnInit() {
    const app = this.localstorageService.get('App', []);
    this.version = app.version;
  }

  async onLogout(){
    this.localstorageService.set('CurrentLogin', []);
    const alert = await this.alertController.create({
      header: '退出登录',
      cssClass: 'twoBtn',
      message: '您确定要退出登录吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: '确认',
          handler: () => {
            console.log('Confirm Okay');
            // 其他代码省略
            // this.navCtrl.navigateRoot(['/passport/login']);
          }
        }
      ]
    });
    await alert.present();
    // this.router.navigateByUrl('/passport/login');
  }

  // back() {
  //   this.outlet.pop(1);
  //   this.router.navigateByUrl('tabs/me');
  //   // this.nav.navigateRoot('tabs/me');
  // }

}
