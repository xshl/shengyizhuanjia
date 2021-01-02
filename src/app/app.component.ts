import { CATEGORIES } from './shared/class/mock.categories';
import { CategoryService } from './shared/services/category.service';
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
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.splashScreen.hide();
      const categoryList =  this.localStorageService.get('Category', []);
      console.log(categoryList.length);
      if (categoryList.length == 0) {
        this.localStorageService.set('Category', CATEGORIES)
      }
    });
  }

  
}

export const APP_KEY = 'App';