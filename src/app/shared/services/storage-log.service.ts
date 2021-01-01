import { Product } from './../class/product';
import { LocalStorageService } from './local-storage.service';
import { StorageLog } from './../class/storageLog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageLogService {

  constructor(private localStorageService: LocalStorageService) { }

  initStorageLog(storageLog: StorageLog, product: Product) {
    storageLog.productBarcode = product.barcode;
    storageLog.type = null;
    storageLog.num = 0;
    storageLog.sum = 0;
    storageLog.time = new Date();
    storageLog.remark = "";
  } 

  insertStorageLog(storageLog: StorageLog) {
    const storageLogList = this.localStorageService.get('StorageLog', []);
    storageLogList.push(storageLog);
    this.localStorageService.set('StorageLog', storageLogList);
  }

  getStorageLogByBarcode(barcode: number): StorageLog[] {
    let res = [];
    const storageLogList = this.localStorageService.get('StorageLog', []);
    for(const storageLog of storageLogList) {
      if (storageLog.productBarcode == barcode) {
        res.push(storageLog);
      }
    }
    return res;
  }
}
