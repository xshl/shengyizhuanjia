import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController, IonRouterOutlet } from '@ionic/angular';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from './../../../shared/services/product.service';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/class/product';
import { Subscription } from 'rxjs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions, OutputType } from '@ionic-native/image-picker/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AjaxResult } from 'src/app/shared/class/ajax-result';

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
              private barcodeScanner: BarcodeScanner,
              private camera: Camera,
              private imagePicker: ImagePicker) { 
    this.subscription = categoryService.watchCategory().subscribe( //use subscribe 
      (activeCategory) => {
        this.product.categoryName = activeCategory.name;
        this.product.categoryId = activeCategory.id;
      }, (error) => {
        console.log(error)
      });
    this.product = this.productService.initProduct();
    this.product.categoryName = "默认分类";
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onPresentActionSheet() {
    if (this.product.images.length === 3) {
      let toast: any;
      toast = await this.toastController.create({
        duration: 3000
      });
      toast.message = '最多只能三张图片';
      toast.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        header: '选择您的操作',
        cssClass: 'ascCss',
        buttons: [
          {
            text: '拍照',
            role: 'destructive',
            handler: () => {
              console.log('camera');
              this.onCamera();

            }
          }, {
            text: '相册',
            handler: () => {
              console.log('photos');
              this.onPicture();
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
  }

  async presentAlertPrompt() {
    let toast: any;
      toast = await this.toastController.create({
        duration: 3000
      });
    const alert = await this.alertController.create({
      header: '新增供货商',
      cssClass: 'twoBtn',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: '输入供货商名称',
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
            // this.product.supplier.name = data.name;
            // this.product.supplier.phone = data.phone;
            // this.onPhoneValid(data.phone, data.name).then((res) => {
            //   console.log(res);
            //   if (res.success) {
            //     this.product.supplier.name = data.name;
            //     this.product.supplier.phone = data.phone;
            //   } else {
            //     console.log(11);

            //     // toast.message = res.error.message;
            //     // toast.present();
            //     return false;
            //   }
            // })

            if (this.onPhoneValid(data.phone, data.name)) {
              this.product.supplier.name = data.name;
              this.product.supplier.phone = data.phone;
            } else {
              toast.message = '电话格式错误或信息为空';
              toast.present();
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // async onPhoneValid(phone: number, name: string): Promise<AjaxResult> {
  //   const pat1 = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
  //   const pat2 = /^(\d{4}-)?\d{6,8}$/;
  //   // console.log(name.match(/^\s*$/));
  //   if (name.match(/^\s*$/)) {
  //     return new AjaxResult(false, null, {
  //       message: '供货商姓名不能为空',
  //       details: ''
  //     });
  //   }
  //   console.log(pat1.test(phone.toString()));
  //   if (pat1.test(phone.toString()) || pat2.test(phone.toString())) {
  //     return new AjaxResult(true, null);
  //   } else {
  //     return new AjaxResult(false, null, {
  //       message: '电话格式不正确',
  //       details: ''
  //     });
  //   }
  // }

  onPhoneValid(phone: number, name: string): boolean {
    const pat1 = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
    const pat2 = /^(\d{4}-)?\d{6,8}$/;
    // console.log(name.match(/^\s*$/));
    if (name.match(/^\s*$/)) {
      return false;
    }
    console.log(pat1.test(phone.toString()));
    if (pat1.test(phone.toString()) || pat2.test(phone.toString())) {
      return true;
    } else {
      return false;
    }
  }

  onScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.product.barcode = barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  onCamera() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);
      this.product.images.push(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  onPicture() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 3 - this.product.images.length,
      quality: 10,
      //The same,
      outputType: OutputType.DATA_URL
    };
    // const imagePickerOpt: ImagePickerOptions = {
    //   quality: 50,  // 照片质量，1-100，默认50
    //   outputType: OutputType.DATA_URL,
    //   allow_video: true,
    // };
    // const imagePickerOpt = {
    //   quality: 50,  // 照片质量，1-100，默认50
    //   destinationType: 0, // Camera.DestinationType.DATA_URL, 返回的数据类型，默认DATA_URL
    //   enodingType: 0, // Camera.EncodingType.JPEG,  照片格式，默认JPEG，还有PNG可选
    //   mediaType: 0, // Camera.MediaType.PICTURE,  媒体类型，默认PICTURE->照片，还有VIDEO等可以选
    //   sourceType: 0 // Camera.PictureSourceType.PHOTOLIBRARY 来源类型，默认CAMERA->相机，还有PHOTOLIBRARY->相册等可以选
    // };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.product.images.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => { 
      console.log(err);
    });
  }

  async onSave(continues: boolean = false){
    let toast: any;
    toast = await this.toastController.create({
      duration: 3000
    });
    this.productService.insert(this.product).then((result) => {
      console.log(result);
      if (result.success === true) {
        toast.message = '商品添加成功';
        toast.present();
        if (continues) {
          console.log('继续添加');
          this.product = this.productService.initProduct();
        }
        else {
          this.router.navigateByUrl('/home');
        }
      } else {
        toast.message = result.error.message;
        toast.present();
      }
    });
  }

}
