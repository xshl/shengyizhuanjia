import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storage: any = window.localStorage;
  constructor() { }

  // 添加一个名叫get方法，根据key获取数据，如果key不存在返回默认值
  get(key: string, defaultValue: any): any{
    let value: any = this.storage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch (error) {
      value = null;
    }
    if (value === null && defaultValue) {
      value = defaultValue;
    }
    return value;
  }

  // 添加一个名叫set方法，根据key设置数据。如果key不存在相当于添加操作，如果key存在相当于修改操作
  set(key: string, value: any){
<<<<<<< HEAD
    this.storage.setItem(key, JSON.stringify(value));
=======
    this.storage.setItem(key,JSON.stringify(value));
>>>>>>> bdf8a335c2cc683d342f14bf2e4bedd6e015aabc
  }

  // 添加一个名叫remove方法
  remove(key: string){
    this.storage.removeItem(key);
  }
}
