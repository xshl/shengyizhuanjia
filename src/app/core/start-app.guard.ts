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
      if ( appConfig.launched === false ) {
        appConfig.launched = true;
        this.localStorageService.set(APP_KEY, appConfig);
        return true;
      }
      const userList = this.localStorageService.get('UserList', []);
      if (userList.length === 0) {
        this.router.navigateByUrl('passport/signup');
      } else {
        this.router.navigateByUrl('tabs/home');
      }
  }
  constructor(private localStorageService: LocalStorageService, private router: Router) { }

}

// export const APP_KEY = 'App';
