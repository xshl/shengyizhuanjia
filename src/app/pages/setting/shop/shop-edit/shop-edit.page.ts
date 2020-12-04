import { User } from './../../../../shared/class/user';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { PassportServiceService } from 'src/app/pages/passport/shared/passport-service.service';
import { Shop } from 'src/app/shared/class/shop';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.page.html',
  styleUrls: ['./shop-edit.page.scss'],
})
export class ShopEditPage implements OnInit {

  property = '';
  title = '';
  changevalue = '';
  value = '';
  shop: Shop;
  user: User;

  constructor(private appc: AppComponent,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private passportService: PassportServiceService,
              private alertController: AlertController,
              private toastController: ToastController,
              private outlet: IonRouterOutlet) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.property = queryParams.property;
      this.title = queryParams.title;
      this.value = queryParams.value;
    });
    this.user = this.passportService.getCurrentUser();
    this.shop = this.passportService.getShop(this.user.shopId);
  }

  ngOnInit() {
  }

  async onSave(form: NgForm){
    if (form.valid){
      let toast: any;
      toast = await this.toastController.create({
        duration: 3000
      });
      if (this.property === 'userName') {
        this.user.userName = this.changevalue;
        this.passportService.updateUserName(this.user);
      } else {
        this.shop[this.property] = this.changevalue;
        this.passportService.updateShop(this.shop);
      }
      toast.message = this.title + '修改成功';
      toast.present();
      this.outlet.pop(1);
      this.router.navigateByUrl('/setting/shop');
    }
  }
}

