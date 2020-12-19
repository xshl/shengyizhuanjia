import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from './../../../shared/services/product.service';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/class/product';
import { Subscription } from 'rxjs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit, OnDestroy {

  product: Product;
  subscription: Subscription
  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private actionSheetController: ActionSheetController,
              private alertController: AlertController,
              private zone: NgZone,
              private router: Router,
              private toastController: ToastController,
              private outlet: IonRouterOutlet,
              private barcodeScanner: BarcodeScanner,) { 
    this.subscription = categoryService.watchCategory().subscribe( //use subscribe 
      (activeCategory)=> {
      this.product.categoryName = activeCategory.name;
      this.product.categoryId = activeCategory.id;
    }, (error) => {
      console.log(error)
    });
    this.product = this.productService.initProduct();
    this.product.categoryName="默认分类";
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      cssClass: 'ascCss',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            console.log('camera');
          }
        }, {
          text: '相册',
          handler: () => {
            console.log('photos');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: '新增供货商',
      cssClass: 'twoBtn',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: '输入供货商名称'
        },
        {
          name: 'phone',
          type: 'number',
          placeholder: '输入供货商电话',
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: '保存',
          handler: (data) => {
            this.zone.run(() => {
              this.product.supplier.name = data.name;
              this.product.supplier.phone = data.phone;
            })
          }
        }
      ]
    });
    await alert.present();
  }

  onScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.product.barcode = barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async onSave(continues: boolean = false){
    let toast: any;
    toast = await this.toastController.create({
        duration: 3000
    });
    this.productService.insert(this.product).then((result) =>{
      console.log(result);
      if (result.success === true) {
        toast.message = '商品添加成功';
        toast.present();
        if (continues){
          console.log('继续添加');
          this.product = this.productService.initProduct();
        }
        else{
          this.router.navigateByUrl('/home');
        }
      } else {
        toast.message = result.error.message;
        toast.present();
      }
    });
  }

}
