import { CurrentLogin } from './shared/class/current-login';
import { LocalStorageService } from './shared/services/local-storage.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Category } from './shared/class/category';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStorageService: LocalStorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      const categoryList =  this.localStorageService.get('Category', []);
      if (categoryList.length == 0) {
        let category = new Category();
        category.name = "默认分类";
        category.id = 1;
        category.children = [];
        categoryList.push(category);
        this.localStorageService.set('Category', categoryList);
      }
    });
  }

  
}

export const APP_KEY = 'App';