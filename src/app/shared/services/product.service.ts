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
      StorageNum: 0,
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


  /**
   * 商品列表分页
   * @param {Product[]} products  商品信息
   * @param {number} index 页码
   * @param {number} size 每页大小
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
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

  /**
   * 根据分类号获取商品
   * @param {number} categoryId
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
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

  /**
   * 获取库存总量
   * @param {Product[]} products
   * @return {*}  {number}
   * @memberof ProductService
   */
  getTotalStorageNum(products: Product[]): number {
    let totalStorageNum = 0;
    for (const product of products) {
      totalStorageNum += product.StorageNum;
    }
    return totalStorageNum;
  }

  /**
   * 获取总成本
   * @param {Product[]} products
   * @return {*}  {number}
   * @memberof ProductService
   */
  getTotalPrice(products: Product[]): number {
    let totalPrice = 0;
    for (const product of products) {
      totalPrice += product.importPrice;
    }
    return totalPrice;
  }

  /**
   * 根据条件筛选商品
   * @param {*} searchProductInput 商品名或条码
   * @return {*}  {Promise<AjaxResult>}
   * @memberof ProductService
   */
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

  /**
   * 获取所有商品
   * @return {*}  {Product[]}
   * @memberof ProductService
   */
  getAllProduct(): Product[] {
    const productList = this.localStorageService.get('Product', []);
    return productList;
  }

  getProductByBarcode(barcode: string): Product {
    const productList = this.localStorageService.get('Product', []);
    let res = this.initProduct();
    for (const product of productList) {
      if (product.barcode == barcode) {
        res = product;
        break;
      }
    }
    return res;
  }

  deleteProductByBarcode(barcode: string): boolean {
    const temp = this.localStorageService.get('Product', []);
    if( temp === null || temp.length === 0){
      return false;
    }
    for(let i = 0; i < temp.length; i++){
      if(temp[i].barcode == barcode){
        temp.splice(i, 1);
        this.localStorageService.set('Product', temp);
        return true;
      }
    }
    return false;
  }
}
