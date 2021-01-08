import { SettingService } from './../pages/setting/setting.service';
import { PassportServiceService } from './../pages/passport/shared/passport-service.service';
import { IonRouterOutlet } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APP_KEY } from '../pages/guide/guide.page';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const appConfig: any = this.localStorageService.get(APP_KEY, {
      version: '0.9.7',
      mobile: '13506976031',
      launched: false
    });
    if (appConfig.launched === false) {
      appConfig.launched = true;
      this.localStorageService.set(APP_KEY, appConfig);
      return true;
    }
    const currentLogin = this.localStorageService.get('CurrentLogin', []);
    const userList = this.localStorageService.get('UserList', []);
    if (userList.length === 0) {
      this.router.navigateByUrl('passport/signup');
    } else if (currentLogin.length !== 0) {
      this.settingService.onload();
      const loginTime = new Date(currentLogin.loginTime);
      const nowTime = new Date();
      // console.log('pastTime' + loginTime);
      // console.log('nowTime' + nowTime);
      if (loginTime.getTime() + 5 * 60 * 1000 >= nowTime.getTime()) {
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
  constructor(private localStorageService: LocalStorageService,
    private router: Router,
    private passportService: PassportServiceService,
    private settingService: SettingService) { }

}

// export const APP_KEY = 'App';
