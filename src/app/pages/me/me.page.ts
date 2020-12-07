import { NavigationEnd, Router } from '@angular/router';
import { PassportServiceService } from './../passport/shared/passport-service.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  name = '';
  phone = '';
  public appPages: Array<{title: string, url: string, icon: string}> = [
    { title: '开店论坛', url: '/tabs/home', icon: 'chatbox-outline' },
    { title: '手机橱窗', url: '/tabs/home', icon: 'create-outline' },
    { title: '邀请有礼', url: '/tabs/home', icon: 'git-merge-outline' },
    { title: '资金账户', url: '/tabs/home', icon: 'cash-outline' },
    { title: '反馈建议', url: '/tabs/home', icon: 'information-outline' },
    { title: '帮助中心', url: '/tabs/home', icon: 'help-circle-outline' },
  ];

  constructor(private passportService: PassportServiceService,
              public router: Router) {
                router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    if (event.url === '/tabs/me') {
                      this.updateData();
                    }
                  }
                });
              }

  ngOnInit() {
    this.updateData();
  }

  updateData() {
    const user = this.passportService.getCurrentUser();
    this.phone = user.phone;
    const shop = this.passportService.getShop(user.shopId);
    this.name = shop.shopName;
    // console.log('phone:' + this.phone + ', name:' + this.name);
    // console.log('加载');
  }

}
