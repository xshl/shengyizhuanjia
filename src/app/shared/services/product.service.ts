import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AjaxResult } from '../class/ajax-result';
import { Product } from '../class/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private localStorageService: LocalStorageService) { }

  /**
   * 初始化商品
   * @return {*}  {Product}
   * @memberof ProductService
   */
  initProduct(): Product {
    return {
      id: '',
      name: '',
      categoryId: null,
      categoryName: '默认类别',
      category: null,
      barcode: '',
      images: [],
      price: null,
      importPrice: null,
      StorageNum: null,
      supplier: {
        id: 0,
        name: null,
        phone: 0
      },
      standard: '',
      remark: '',
    };
  }

  /**
   * 新增商品
   * @param {Product} input 商品信息
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
  async insert(input: Product): Promise<AjaxResult>{
    input.id = UUID.UUID();
    const products = this.localStorageService.get("product",[]);
    if (input.name.match(/^\s*$/) || input.categoryName.match(/^\s*$/))
    for(const product of products) {
      if(product.name === input.name) {
        return new AjaxResult(false, null, {
          message: '该商品名称已存在',
          details: ''
        });
      }
      if(product.barcode === input.barcode){
        return new AjaxResult(false, null, {
          message: '条形码重复，商品已存在',
          details: ''
        });
      }
    }
    products.push(input);
    this.localStorageService.set("product", products);
    return new AjaxResult(true, null);
  }
}
