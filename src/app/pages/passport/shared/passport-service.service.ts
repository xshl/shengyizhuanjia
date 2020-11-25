import { User } from './../../../shared/class/user';
import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Md5 } from 'ts-md5';
import { Signup } from '../signup/signup';
import { Shop } from 'src/app/shared/class/shop';

@Injectable({
  providedIn: 'root'
})
export class PassportServiceService {

  constructor(private localStorageService: LocalStorageService) { }

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

    const { phone, email, shopName, password} = signup;
    const md5Password = Md5.hashStr(password).toString();
    const user: User = {
      id: userList.length + 1,
      phone,
      email,
      createTime: new Date(),
      shopId: shopList.length + 1,
      userName: '',
      passwordToken: md5Password,
      wechatId: '',
    };
    const shop: Shop = {
      id: shopList.length + 1,
      shopName,
      shortName: '',
      shopTel: '',
      shopType: ''
    };
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
