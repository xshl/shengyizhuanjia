import { IonRouterOutlet } from '@ionic/angular';
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
              private router: Router) { }

  ngOnInit() {
    const app = this.localstorageService.get('App', []);
    this.version = app.version;
  }

  onLogout(){
    this.localstorageService.set('CurrentLogin', []);
    this.outlet.pop(2);
    this.router.navigateByUrl('/passport/login');
  }

  back() {
    this.outlet.pop(1);
    this.router.navigateByUrl('tabs/me');
  }

}
