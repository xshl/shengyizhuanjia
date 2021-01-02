import { ProductService } from './../../../../shared/services/product.service';
import { Product } from './../../../../shared/class/product';
import { StorageLogService } from './../../../../shared/services/storage-log.service';
import { StorageLog } from './../../../../shared/class/storageLog';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-log',
  templateUrl: './storage-log.page.html',
  styleUrls: ['./storage-log.page.scss'],
})
export class StorageLogPage implements OnInit {

  private storageLog: StorageLog[];
  private product: Product;
  constructor(private activatedRoute: ActivatedRoute,
              private storageLogService: StorageLogService,
              private productService: ProductService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.storageLog = this.storageLogService.getStorageLogByBarcode(queryParams.barcode);
      this.product = this.productService.getProductByBarcode(queryParams.barcode);
    });
   }

  ngOnInit() {
  }

}
