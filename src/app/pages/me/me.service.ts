import { PassportServiceService } from './../passport/shared/passport-service.service';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/class/user';
import { Shop } from 'src/app/shared/class/shop';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  constructor(private passportService: PassportServiceService) { }

  user: User = this.passportService.getCurrentUser();
  shop: Shop = this.passportService.getShop(this.user.shopId);

  getShop(): Shop{
    return this.shop;
  }

  getUser(): User{
    return this.user;
  }

}
