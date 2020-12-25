import { async } from '@angular/core/testing';
import { ProductService } from './../../../shared/services/product.service';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Product } from './../../../shared/class/product';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AjaxResult } from 'src/app/shared/class/ajax-result';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  private currentIndex: number;   // 当前页码，显示哪一页的商品数据
  private products: Product[];    // 存放商品数据
  private currentProduct: Product[];
  private total: number;          // 商品总记录数
  private queryTerm: string;      // 查询条件
  private categoryId: number;     // 类别编号，用于保存用户选择的类别，初始值为-1
  private totalStorageNum: number;  // 总库存数
  private totalPrice: number;       // 总成本
  private isAddProduct: boolean;    // 是否在当前页面点击新增商品
  private productCount: number;

  constructor(private loadingController: LoadingController,
    private productService: ProductService,
    private toastController: ToastController) {
    this.categoryId = -1;
    this.currentIndex = 0;
    this.productCount = 0;
  }

  async ngOnInit() {
    this.onLoadData();
  }

  ionViewWillEnter(){
    this.onLoadData();
  }

  async onLoadData() {
    // 自行添加初始化代码
    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍候...',
      spinner: 'bubbles',
    });
    loading.present();
    try {
      this.products = this.productService.getAllProduct();
      this.total = this.products.length;
      // const ajaxResult: AjaxResult = await this.productService.getList(this.currentIndex, 10);
      this.productService.getList(this.products, this.currentIndex, 10).then((res) => {
        if (res.success) {
          this.productCount = res.result.total;
          this.currentProduct = res.result.currentproductList;
          this.totalPrice = this.productService.getTotalPrice(this.products);
          this.totalStorageNum = this.productService.getTotalStorageNum(this.products);
        } else {
          console.log(res.error.message);
        }
      });

      // this.ionViewDidEnter();
      loading.dismiss();

    } catch (error) {
      console.log(error);
      //实际开发中应记录在日志文件中
    }
  }

  async onInput(event) {
    this.currentIndex = 0;
    const condition = event.target.value;
    if (condition == '') {
      this.products = this.productService.getAllProduct();
    } else {
      this.productService.getListByCondition(condition).then((res) => {
        if (res.success) {
          this.products = res.result;
        } else {
          console.log(res.error.message);
        }
      });
    }
    this.productService.getList(this.products, this.currentIndex, 10).then((res) => {
      if (res.success) {
        this.productCount = res.result.total;
        this.currentProduct = res.result.currentproductList;
        this.totalPrice = this.productService.getTotalPrice(this.products);
        this.totalStorageNum = this.productService.getTotalStorageNum(this.products);
      } else {
        console.log(res.error.message);
      }
    });
  }

  async onRefresh(event) {
    this.currentIndex = 0;
    const refresher = event.target;
    this.productService.getList(this.products, this.currentIndex, 10).then((res) => {
      if (res.success) {
        this.productCount = res.result.total;
        this.currentProduct = res.result.currentproductList;
        this.totalPrice = this.productService.getTotalPrice(this.products);
        this.totalStorageNum = this.productService.getTotalStorageNum(this.products);
      } else {
        console.log(res.error.message);
      }
    });
    refresher.complete();
  }

  async onInfinite(event) {
    const infiniteScroll = event.target;
    this.currentIndex++;
    setTimeout(async () => {
      if (this.productCount == this.products.length) {
        // const toast = await this.toastController.create({
        //   message: '已是最后一页',
        //   duration: 3000
        // });
        // toast.present();
      } else {
        this.productService.getList(this.products, this.currentIndex, 10).then((res) => {
          if (res.success) {
            // this.total = res.result.total;
            this.currentProduct = this.currentProduct.concat(res.result.currentproductList);
            this.totalPrice = this.productService.getTotalPrice(this.products);
            this.totalStorageNum = this.productService.getTotalStorageNum(this.products);
            this.productCount += res.result.total;
          } else {
            console.log(res.error.message);
          }
        });
      }
      infiniteScroll.complete();
    }, 500);
  }

}
