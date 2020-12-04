import { User } from './../../../shared/class/user';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Shop } from './../../../shared/class/shop';
import { PassportServiceService } from './../../passport/shared/passport-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  shop: Shop;
  user: User;
  constructor(private passportService: PassportServiceService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.user = this.passportService.getCurrentUser();
    this.shop = this.passportService.getShop(this.user.shopId);
    console.log('jiazai');
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }
}
