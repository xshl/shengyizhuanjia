import { Product } from './../class/product';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AjaxResult } from '../class/ajax-result';

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
  async insert(input: Product): Promise<AjaxResult> {
    input.id = UUID.UUID();
    const products = this.localStorageService.get('Product', []);
    console.log(input);
    for (const product of products) {
      if (product.name === input.name) {
        return new AjaxResult(false, null, {
          message: '该商品名称已存在',
          details: ''
        });
      }
      if (product.barcode === input.barcode) {
        return new AjaxResult(false, null, {
          message: '条形码重复，商品已存在',
          details: ''
        });
      }
    }
    products.push(input);
    this.localStorageService.set('Product', products);
    return new AjaxResult(true, null);
  }


  async getList(products: Product[], index: number, size: number): Promise<AjaxResult> {
    if (index < 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('分页的索引应大于等于零');
    }
    if (size <= 0) {
      // 实际开发中应抛出异常类对象
      throw new Error('每页显示的记录数应大于零');
    }
    // 其他代码省略
    if (products.length === 0) {
      return new AjaxResult(true, {
        total: 0,
        products
      })
    }
    const currentproductList = products.slice(index * size, (index + 1) * size);
    return new AjaxResult(true, {
      total: currentproductList.length,
      currentproductList
    })
  }

  async getListByCategoryId(categoryId: number): Promise<AjaxResult> {
    const productList: Product[] = this.localStorageService.get('Product', []);
    let result = [];
    for (const product of productList) {
      if (product.categoryId === categoryId) {
        result.push(product);
      }
    }
    return new AjaxResult(true, result);
  }

  getTotalStorageNum(products: Product[]): number {
    let totalStorageNum = 0;
    for (const product of products) {
      totalStorageNum += product.StorageNum;
    }
    return totalStorageNum;
  }

  getTotalPrice(products: Product[]): number {
    let totalPrice = 0;
    for (const product of products) {
      totalPrice += product.importPrice;
    }
    return totalPrice;
  }

  async getListByCondition(searchProductInput: any): Promise<AjaxResult> {
    const productList: Product[] = this.localStorageService.get('Product', []);
    let result = [];
    for (const product of productList) {
      if (product.name.toString().indexOf(searchProductInput) !== -1 ||
        product.barcode.toString().indexOf(searchProductInput) !== -1) {
        result.push(product);
      }
    }
    return new AjaxResult(true, result);
  }

  getAllProduct(): Product[] {
    const productList = this.localStorageService.get('Product', []);
    return productList;
  }
}
