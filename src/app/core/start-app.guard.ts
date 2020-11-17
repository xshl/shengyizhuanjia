import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const appConfig: any = this.localStorageService.get(APP_KEY, {
        isLaunched: false,
        version: '1.0.0'
      });
      if ( appConfig.isLaunched === false ) {
        appConfig.isLaunched = true;
        this.localStorageService.set(APP_KEY, appConfig);
        return true;
      } else {
        this.router.navigateByUrl('home');
        return false;
      }
      return true;
  }
  constructor(private localStorageService: LocalStorageService, private router: Router) { }

}

export const APP_KEY = 'App';
