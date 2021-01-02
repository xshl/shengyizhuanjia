import { StorageLogService } from './../../../../shared/services/storage-log.service';
import { StorageLog } from './../../../../shared/class/storageLog';
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


  private IncreOrDecre: string = "IncreaseStorage";
  private product: Product;
  private num: number;
  private remark: string;
  private inFor = {
    'IncreaseStorage': '入库数量',
    'DecreaseStorage': '出库数量',
  };
  private storageLog = new StorageLog();
  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private alertController: AlertController,
              private toastController: ToastController,
              private storagrLogService: StorageLogService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.product = this.productService.getProductByBarcode(queryParams.barcode);
    });
  }

  ngOnInit() {
  }

  async onConfirm() {
    this.storagrLogService.initStorageLog(this.storageLog, this.product);
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
        if (this.IncreOrDecre == 'IncreaseStorage') {
          this.storageLog.type = "入库";
        } else {
          this.storageLog.type = "出库";
        }
        toast.message = this.storageLog.type + "成功";
        toast.present();
        this.storageLog.num = this.num;
        this.storageLog.remark = this.remark;
        if (this.IncreOrDecre == 'IncreaseStorage') {
          this.storageLog.type = "入库";
        } else {
          this.storageLog.type = "出库";
        }
        this.storageLog.sum = this.product.StorageNum;
        this.storagrLogService.insertStorageLog(this.storageLog);
        this.num = null;
      } else {
        toast.message = "修改失败，出现未知错误";
        toast.present();
      }
    })
  }

}
