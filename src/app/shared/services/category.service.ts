import { ActiveCategory } from './../class/active-category';
import { Category } from './../class/category';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { AjaxResult } from '../class/ajax-result';
import { CATEGORIES } from '../class/mock.categories';
import { cat } from 'tencentcloud-sdk-nodejs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  activeCategory = new Subject<ActiveCategory>();

  constructor(private localStorageService: LocalStorageService) { }

  /*
   * 从本地存储中获取所有的商品类别数据
   * @return {*}  {Promise<AjaxResult>} 商品数据
   * @memberof CategoryService
   */
  async getAll(): Promise<AjaxResult> {
    const categories = this.localStorageService.get('Category', []);
    return {
      targetUrl: '',
      result: categories,
      success: true,
      error: null,
      unAuthorizedRequest: false
    };
  }

  /*
   * 初始化商品类别
   * @param {number} id 商品id
   * @param {string} name 商品名
   * @return {*}  {Category}
   * @memberof CategoryService
   */
  initCategory(id: number, name: string): Category {
    let category = new Category();
    const categorychild = new Category();
    if (id == 0) {
      category.id = this.getCategoryLength();
      category.name = name;
      category.children = [];
      category.children.push(categorychild);
    } else {
      category.id = id;
      category.name = name;
      category.children = [];
      categorychild.id = category.id * 10 + this.getCategoryChildrenLength(id) + 1;
      categorychild.name = '';
      categorychild.children = [];
      category.children.push(categorychild);
    }
    return category;
  }

  /*
   * 判断商品类别名字是否唯一
   * @param {Category} category 商品类别
   * @return {*}  {Promise<AjaxResult>}
   * @memberof CategoryService
   */
  async isUniqueName(category: Category): Promise<AjaxResult> {
    const categoryLocal = this.getCategory(category.id);
    const categoryList = this.localStorageService.get('Category', []);
    let i: number, j: number;
    console.log(categoryLocal);
    if (categoryLocal.name == '默认类别') {
      for (i = 0; i < categoryList.length; i++) {
        if (category.name == categoryList[i].name) {
          return new AjaxResult(false, null, {
            message: '大类名与已存在大类名重复',
            details: ''
          });
        }
      }
    } else {
      for (i = 0; i < category.children.length; i++) {
        for (j = 0; j < categoryLocal.children.length; j++) {
          if (category.children[i].name == categoryLocal.children[j].name) {
            return new AjaxResult(false, null, {
              message: '子类与已存在子类存在类名重复',
              details: ''
            });
          }
        }
      }
    }
    // 当前传入自我检测
    for (i = 0; i < category.children.length; i++) {
      if (category.children[i].name.match(/^\s*$/)) {
        return new AjaxResult(false, null, {
          message: '第' + (i + 1) + '个小类全为空白字符，请重新输入类名',
          details: ''
        });
      }
    }
    for (i = 0; i < category.children.length; i++) {
      for (j = i + 1; j < category.children.length; j++) {
        if (category.children[i].name == category.children[j].name) {
          return new AjaxResult(false, null, {
            message: '新增子类间存在重复类名',
            details: ''
          });
        }
      }
    }
    return new AjaxResult(true, null);
  }

  /*
   * 新增商品大类别
   * @param {Category} category
   * @memberof CategoryService
   */
  insertCategory(category: Category) {
    console.log("新增商品");
    const categoryList = this.localStorageService.get('Category', []);
    const categoryLast = categoryList[categoryList.length - 1];
    categoryLast.id++;
    categoryList[categoryList.length - 1] = category;
    categoryList.push(categoryLast);
    this.localStorageService.set('Category', categoryList);
  }

  /*
   * 新增商品小类别
   * @param {Category} category
   * @memberof CategoryService
   */
  insertSubCategory(category: Category) {
    console.log("新增小分类");
    const categoryLocal = this.getCategory(category.id);
    for (const categoryChild of category.children) {
      categoryLocal.children.push(categoryChild);
    }
    this.updateLocalCategory(categoryLocal);
  }

  /*
   * 根据id获取商品
   * @param {number} id
   * @return {*}  {Category}
   * @memberof CategoryService
   */
  getCategory(id: number): Category {
    const categotyList = this.localStorageService.get('Category', []);
    for (const category of categotyList) {
      if (category.id == id) {
        return category;
      }
    }
    return null;
  }

  /*
   * 获取商品大分类列表长度
   * @return {*}  {number}
   * @memberof CategoryService
   */
  getCategoryLength(): number {
    const categotyList = this.localStorageService.get('Category', []);
    return categotyList.length;
  }

  /*
   * 获取商品小分类长度
   * @param {number} id
   * @return {*}  {number}
   * @memberof CategoryService
   */
  getCategoryChildrenLength(id: number): number {
    const category = this.getCategory(id);
    return category.children.length;
  } 

  /*
   * 更新商品分类信息
   * @param {Category} category
   * @return {*}  {Promise < AjaxResult >}
   * @memberof CategoryService
   */
  async updateLocalCategory(category: Category): Promise<AjaxResult> {
    let categoryList = this.localStorageService.get('Category', []);
    let i: number;
    for (i = 0; i < categoryList.length; i++) {
      if (categoryList[i].id == category.id) {
        categoryList[i] = category;
      }
    }
    this.localStorageService.set('Category', categoryList);
    return new AjaxResult(true, null);
  }

  /*
   * 删除商品大分类
   * @param {number} id
   * @return {*}  {boolean}
   * @memberof CategoryService
   */
  deleteCategory(id: number): boolean {
    const categoryList = this.localStorageService.get('Category', []);
    let i: any;
    let j: any;
    for (i = 0; i < categoryList.length; i++) {
      if (categoryList[i].id == id) {
        for (j = i + 1; j < categoryList.length; j++) {
          categoryList[j].id--;
        }
        categoryList.splice(i, 1);
        this.localStorageService.set('Category', categoryList);
        return true;
      }
    }
    return false;
  }

  /*
   * 删除商品小分类
   * @param {Category} category
   * @param {number} id
   * @return {*}  {boolean}
   * @memberof CategoryService
   */
  delteteChild(category: Category, id: number): boolean {
    console.log("c: Category ,cid: number" + category.name + id);
    let categoryList = this.localStorageService.get('Category', []);
    let i: any;
    let j: any;
    for (i = 0; i < category.children.length; i++) {
      if (category.children[i].id == id) {
        for (j = i + 1; j < category.children.length; j++) {
          category.children[j].id = category.children[j].id - 1;
        }
        category.children.splice(i, 1);
        for (j = 0; j < categoryList.length; j++) {
          if (category.name === categoryList[j].name) {
            categoryList[j] = category;
          }
        }
        this.localStorageService.set('Category', categoryList);
        return true;
      }
    }
    return false;
  }

  /*
   * 判断大分类名字是否重复
   * @param {Category} category
   * @return {*}  {Promise<AjaxResult>}
   * @memberof CategoryService
   */
  async isUniqueCategoryName(category: Category): Promise<AjaxResult> {
    const categoryList = this.localStorageService.get('Category', []);
    let i: number, j: number;
    for (i = 0; i < category.children.length; i++) {
      if (category.name.match(/^\s*$/)) {
        return new AjaxResult(false, null, {
          message: '全为空白字符，请重新输入类名',
          details: ''
        });
      }
    }
    for (i = 0; i < categoryList.length; i++) {
      if (category.name == categoryList[i].name) {
        return new AjaxResult(false, null, {
          message: '大类名与已存在大类名重复',
          details: ''
        });
      }
    }
    return new AjaxResult(true, null);
  }

  /*
   * 判断小分类名字是否重复
   * @param {Category} category
   * @param {number} i
   * @return {*}  {Promise<AjaxResult>}
   * @memberof CategoryService
   */
  async isUniqueChildName(category: Category, i: number): Promise<AjaxResult> {
    const categoryLocal = this.getCategory(category.id);
    let j: number;
    for (j = 0; j < category.children.length; j++) {
      if (category.children[j].name.match(/^\s*$/)) {
        return new AjaxResult(false, null, {
          message: '全为空白字符，请重新输入类名',
          details: ''
        });
      }
    }
    for (j = 0; j < categoryLocal.children.length; j++) {
      if (category.children[i].name == categoryLocal.children[j].name) {
        return new AjaxResult(false, null, {
          message: '子类与已存在子类存在类名重复',
          details: ''
        });
      }
    }
    return new AjaxResult(true, null);
  }

  watchCategory():Observable<ActiveCategory>{
    return this.activeCategory.asObservable();
  }
  
  /**
   * 向订阅者发送通知，传送数据
   * @param {ActiveCategory} category
   * @memberof CategoryService
   */
  setActiveCategory(category: ActiveCategory){
    this.activeCategory.next(category);
  }
}