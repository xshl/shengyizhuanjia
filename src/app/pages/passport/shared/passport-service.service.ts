import { Signup } from './../signup/signup';
import { User } from './../../../shared/class/user';
import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Md5 } from 'ts-md5';
import { Shop } from 'src/app/shared/class/shop';

@Injectable({
  providedIn: 'root'
})
export class PassportServiceService {

  constructor(private localStorageService: LocalStorageService) { }

  /*
   * 初始化User
   * @param {Signup} signup 注册信息
   * @return {*}  {User}  用户信息
   * @memberof PassportServiceService
   */
  initUser(signup: Signup): User{
    const user = new User();
    user.phone = signup.phone;
    user.email = signup.email;
    user.createTime = new Date();
    user.passwordToken = Md5.hashStr(signup.password).toString();
    return user;
  }

  /*
   * 初始化Shop
   * @param {Signup} signup 注册信息
   * @return {*}  {Shop}  商店信息
   * @memberof PassportServiceService
   */
  initShop(signup: Signup): Shop{
    const shop = new Shop();
    shop.shopName = signup.shopName;
    return shop;
  }

  /*
   * 注册
   * @param {Signup} signup
   * @return {*}  {Promise<AjaxResult>}
   * @memberof PassportServiceService
   */
  async addUser(signup: Signup): Promise<AjaxResult> {
    const userList = this.localStorageService.get('UserList', []);
    const shopList = this.localStorageService.get('ShopList', []);
    let i: any;
    for (i = 0; i < userList.length; i++){
      for (i = 0; i < userList.length; i++){
        if (signup.phone === userList[i].phone){
          return new AjaxResult(false, null, {
            message: '您的手机号码已经被注册',
            details: ''
          });
        }
      }
    }

    for (i = 0; i < userList.length; i++){
      for (i = 0; i < userList.length; i++){
        if (signup.email === userList[i].email){
          return new AjaxResult(false, null, {
            message: '该邮箱已被注册',
            details: ''
          });
        }
      }
    }

    const user = this.initUser(signup);
    user.id = userList.length + 1;
    user.shopId = shopList.length + 1;
    const shop = this.initShop(signup);
    shop.id = shopList.length + 1;
    userList.push(user);
    shopList.push(shop);
    this.localStorageService.set('UserList', userList);
    this.localStorageService.set('ShopList', shopList);

    return new AjaxResult(true, null);

  }

  /*
   * 判断手机号码是否唯一
   * @param {Signup} signup
   * @return {*}
   * @memberof PassportServiceService
   */
  async isUniquePhone(signup: Signup): Promise<AjaxResult>{
    const userList = this.localStorageService.get('UserList', []);
    let i: any;
    for (i = 0; i < userList.length; i++){
      for (i = 0; i < userList.length; i++){
        if (signup.phone === userList[i].phone){
          return new AjaxResult(false, null, {
            message: '您的手机号码已经被注册',
            details: ''
          });
        }
      }
    }
    return new AjaxResult(true, null);
  }
}
