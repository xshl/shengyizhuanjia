import { LocalStorageService } from './../../shared/services/local-storage.service';
import { PassportServiceService } from './../passport/shared/passport-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private passportService: PassportServiceService,
              private localStorageService: LocalStorageService) { }

  onload() {
    const tuser = this.passportService.getCurrentUser();
    const tshop = this.passportService.getShop(tuser.id);
    const user = {
      ...tuser,
      ...tshop
    };
    this.localStorageService.set('NowUser', user);
  }

  getUser(){
    const nowUser = this.localStorageService.get('NowUser', []);
    return nowUser;
  }

}
