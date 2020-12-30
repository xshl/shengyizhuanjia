import { PassportServiceService } from './../../passport/shared/passport-service.service';
import { ProductService } from './../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from './../../../shared/class/product';
import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { PopoverPage } from './popover/popover.page';
import { AjaxResult } from 'src/app/shared/class/ajax-result';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  private product: Product;
  private CheckPrice = false;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private popoverController: PopoverController,
              private alertController: AlertController,
              private passportService: PassportServiceService,
              private toastController: ToastController,
              private actionSheetController: ActionSheetController) { 
    activatedRoute.queryParams.subscribe(queryParams => {
      this.product = this.productService.getProductByBarcode(queryParams.barcode);
    });

  }

  ngOnInit() {
    
  }

  async onPresentPopover(event){
    // kind of a component 
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: event,
      componentProps: {'barcode': this.product.barcode},
      translucent: false,
      backdropDismiss: true
    });
    await popover.present();
  }

  async checkUser(){ 
    // to check if the User has the right to know the importPrice
    // In this part, I just use the method in PassportService
    let toast;
    toast = await this.toastController.create({
      duration: 3000
    });
    const alert = await this.alertController.create({
      header: '请验证账号密码',
      cssClass: 'twoBtn',
      inputs: [{
        name: 'account',
        type: 'text',
        placeholder: '请输入账户',
      },{
        name: 'password',
        type: 'password',
        placeholder: '请输入密码'
      }],
      buttons: [{
        text: '确定',
        handler: (data) => {
          console.log('确定');
          const currentUser = this.passportService.getCurrentUser();
          if (data.account.match(/^\s*$/) || data.password.match(/^\s*$/)) {
            toast.message = '账号或密码为空';
            toast.present();
            return false;
          }
          if (data.account != currentUser.phone && data.account != currentUser.email) {
            toast.message = '账号非当前登录账号';
            toast.present();
            return false;
          }
          const res= this.passportService.checkPsd(data.account, data.password);
          if (res) {
            console.log('验证成功');
            this.CheckPrice = true;
          } else {
            console.log('验证失败');
            toast.message = '密码错误';
            toast.present();
            return false;
          }
        }
      },{
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      }]
    });
    await alert.present();
  }

  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'ascCssShare',
      buttons: [{
        text: '好友',
        icon: 'logo-wechat',
        //icons, there are a lot of icons in the website of Ionic, choose whatever you like
        handler: () => {
          console.log('分享给微信好友');
        }
      },{
        text: '朋友圈',
        icon: 'aperture-outline',
        handler: () => {
          console.log('分享到朋友圈');
        }
      },{
        text: '短信',
        icon: 'mail',
        handler: () => {
          console.log('发送到短信');
        }
      },{
        text: 'QQ',
        icon: 'logo-tux',
        handler: () => {
          console.log('分享到QQ');
        }
      },{
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('cancel');
        }
      }]
    });
    await actionSheet.present();
  }
}
