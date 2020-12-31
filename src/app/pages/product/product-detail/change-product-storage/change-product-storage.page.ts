import { AlertController, ToastController } from '@ionic/angular';
import { ProductService } from './../../../../shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/class/product';

@Component({
  selector: 'app-change-product-storage',
  templateUrl: './change-product-storage.page.html',
  styleUrls: ['./change-product-storage.page.scss'],
})
export class ChangeProductStoragePage implements OnInit {


  private IncreOrDecre: string="IncreaseStorage";
  private product: Product;
  private num: number;
  private inFor = {
    'IncreaseStorage': '入库数量',
    'DecreaseStorage': '出库数量',
  };
  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private alertController: AlertController,
              private toastController: ToastController) { 
    activatedRoute.queryParams.subscribe(queryParams => {
      this.product = this.productService.getProductByBarcode(queryParams.barcode);
    });
  }

  ngOnInit() {
  }

  async onConfirm() {
    const toast = await this.toastController.create({
      duration: 2000,
    });
    if (!this.num.toString().match(/^[1-9]\d*$/)) {
      toast.message = "请输入正整数"
      toast.present();
    } else if (this.IncreOrDecre == 'IncreaseStorage') {
      this.product.StorageNum += this.num;
    } else {
      if (this.product.StorageNum - this.num < 0) {
        toast.message = "出库数量不能大于库存"
        toast.present();
      } else {
        this.product.StorageNum -= this.num;
      }
    }
    this.productService.ChangeProduct(this.product).then((res) => {
       if (res.success) {
         toast.message = "修改成功";
         toast.present();
         this.num = null;
       } else {
         toast.message = "修改失败，出现未知错误";
         toast.present();
       }
    })
  }

}
