import { SettingService } from './../../setting/setting.service';
import { AppComponent } from 'src/app/app.component';
import { Signup } from './../signup/signup';
import { User } from './../../../shared/class/user';
import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/class/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Md5 } from 'ts-md5';
import { Shop } from 'src/app/shared/class/shop';
import { CurrentLogin } from 'src/app/shared/class/current-login';

@Injectable({
  providedIn: 'root'
})
export class PassportServiceService {

  constructor(private localStorageService: LocalStorageService) { }

  /*
   * 初始化 User
   * @param {Signup} signup 注册信息
   * @return {*}  {User}  用户信息
   * @memberof PassportServiceService
   */
  initUser(signup: Signup): User {
    const user = new User();
    user.id = 0;
    user.shopId = 0;
    user.userName = '';
    user.phone = signup.phone;
    user.email = signup.email;
    user.createTime = new Date();
    user.passwordToken = Md5.hashStr(signup.password).toString();
    user.wechatId = '';
    return user;
  }

  /*
   * 初始化 Shop
   * @param {Signup} signup 注册信息
   * @return {*}  {Shop}  商店信息
   * @memberof PassportServiceService
   */
  initShop(signup: Signup): Shop {
    const shop = new Shop();
    shop.id = 0;
    shop.shopName = signup.shopName;
    shop.shortName = '';
    shop.shopTel = '';
    shop.shopType = '';
    return shop;
  }

  /*
   * 初始化 LoginAccount
   * @param {User} user 用户信息
   * @return {*}  {LoginAccount}  登录信息
   * @memberof PassportServiceService
   */
  initCurrentLogin(user: User): CurrentLogin {
    const currentLogin = new CurrentLogin();
    currentLogin.loginAccount = user.phone;
    currentLogin.type = 0;
    currentLogin.loginTime = new Date().toString();
    return currentLogin;
  }

  /*
   * 判断密码是否正确，并返回登录类型
   * @param {string} loginIdentifier  账号
   * @param {string} password 密码
   * @return {*}  {number}  0：手机号码登录 1：邮箱登录 -1：密码错误或用户不存在
   * @memberof PassportServiceService
   */
  confirmAccount(loginIdentifier: string, password: string): number {
    const users = this.localStorageService.get('UserList', []);
    const passwordToken = Md5.hashStr(password).toString();
    for (const user of users) {
      if (user.phone === loginIdentifier && user.passwordToken === passwordToken) {
        return 0;
      }
      if (user.email === loginIdentifier && user.passwordToken === passwordToken) {
        return 1;
      }
      return -1;
    }
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

    if (this.checkAccount(signup.phone) === 0) {
      return new AjaxResult(false, null, {
        message: '您的手机号码已经被注册',
        details: ''
      });
    }

    if (this.checkAccount(signup.email) === 1) {
      return new AjaxResult(false, null, {
        message: '该邮箱已被注册',
        details: ''
      });
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
   * 登录
   * @param {string} loginIdentifier  账号
   * @param {string} password 密码
   * @return {*}  {Promise<AjaxResult>} 是否登录成功
   * @memberof PassportServiceService
   */
  async login(loginIdentifier: string, password: string): Promise<AjaxResult> {
    if (this.checkAccount(loginIdentifier) === -1) {
      return new AjaxResult(false, null, {
        message: '账号不存在',
        details: ''
      });
    }
    if (!(await this.checkPsd(loginIdentifier, password)).success) {
      return new AjaxResult(false, null, {
        message: '密码错误',
        details: ''
      });
    }
    const user = this.getUser(loginIdentifier);
    const currentLogin = this.initCurrentLogin(user);
    currentLogin.type = this.confirmAccount(loginIdentifier, password);
    currentLogin.loginTime = new Date().toString();
    this.localStorageService.set('CurrentLogin', currentLogin);
    this.localStorageService.set('HistoryLogin', loginIdentifier);
    return new AjaxResult(true, null);
  }

  /*
   * 判断手机号码是否唯一
   * @param {Signup} signup
   * @return {*}
   * @memberof PassportServiceService
   */
  async isUniquePhone(signup: Signup): Promise<AjaxResult> {
    if (this.checkAccount(signup.phone) === 0) {
      return new AjaxResult(false, null, {
        message: '您的手机号码已经被注册',
        details: ''
      });
    }
    return new AjaxResult(true, null);
  }

  /*
   * 判断此登录账号是否存在
   * @param {string} loginIdentifier  账号
   * @return {*}  {number}  0：手机号已存在 1：邮箱已存在 -1：不存在
   * @memberof PassportServiceService
   */
  checkAccount(loginIdentifier: string): number {
    const userlist = this.localStorageService.get('UserList', []);
    for (const user of userlist) {
      if (user.phone === loginIdentifier) {
        return 0;
      }
      if (user.email === loginIdentifier) {
        return 1;
      }
    }
    return -1;
  }

  /*
   * 验证密码是否正确
   * @param {string} loginIdentifier  账号
   * @param {string} password 密码
   * @return {*}  {boolean} 是否正确
   * @memberof PassportServiceService
   */
  async checkPsd(loginIdentifier: string, password: string): Promise<AjaxResult> {
    const user = this.getUser(loginIdentifier);
    const passwordToken = Md5.hashStr(password).toString();
    console.log(user.passwordToken);
    console.log(passwordToken);
    if (user.passwordToken === passwordToken) {
      return new AjaxResult(true, null);
    }
    return new AjaxResult(false, null, {
      message: '密码错误',
      details: ''
    });
  }

  /*
   * 获取用户信息
   * @param {string} loginIdentifier  账号
   * @return {*}  {User}  用户信息
   * @memberof PassportServiceService
   */
  getUser(loginIdentifier: string): User {
    const userList = this.localStorageService.get('UserList', []);
    for (const user of userList) {
      if (user.email === loginIdentifier || user.phone === loginIdentifier) {
        return user;
      }
    }
    return null;
  }

  /*
   * 获取最近一次登录账号
   * @return {*}  {string}  账号
   * @memberof PassportServiceService
   */
  getHistoryLogin(): string {
    const historyLogin = this.localStorageService.get('HistoryLogin', []);
    return historyLogin;
  }

  /*
   * 更新登陆时间
   * @memberof PassportServiceService
   */
  updateLoginTime() {
    const currentLogin = this.localStorageService.get('CurrentLogin', []);
    currentLogin.loginTime = new Date().toString();
  }

  /*
   * 获取店铺信息
   * @param {number} shopId 店铺号
   * @return {*}  {Shop}  店铺信息
   * @memberof PassportServiceService
   */
  getShop(shopId: number): Shop {
    const shopList = this.localStorageService.get('ShopList', []);
    for (const shop of shopList) {
      if (shopId === shop.id) {
        return shop;
      }
    }
  }

  /*
   * 获取当前用户信息
   * @return {*}  {User}  当前用户信息
   * @memberof PassportServiceService
   */
  getCurrentUser(): User {
    const currentLogin = this.localStorageService.get('CurrentLogin', []);
    return this.getUser(currentLogin.loginAccount);
  }

  /*
   * 修改密码
   * @param {User} user 用户信息
   * @param {string} newpassword  新密码
   * @memberof PassportServiceService
   */
  updatePsd(phone: string, newpassword: string) {
    const userList = this.localStorageService.get('UserList', []);
    for (const users of userList) {
      if (users.phone === phone) {
        users.passwordToken = Md5.hashStr(newpassword).toString();
      }
    }
    this.localStorageService.set('UserList', userList);
  }

  /*
   * 更新店铺信息
   * @param {Shop} shop 店铺信息
   * @memberof PassportServiceService
   */
  updateShop(shop: Shop) {
    const shopList = this.localStorageService.get('ShopList', []);
    let i: any;
    for (i = 0; i < shopList.length; i++){
      if (shopList[i].id === shop.id) {
        shopList[i] = shop;
        this.localStorageService.set('ShopList', shopList);
      }
    }
  }

  /*
   * 更新用户姓名
   * @param {User} user 用户信息
   * @memberof PassportServiceService
   */
  updateUserName(user: User){
    const userList = this.localStorageService.get('UserList', []);
    let i: any;
    for (i = 0; i < userList.length; i++){
      if (userList[i].id === user.id) {
        userList[i] = user;
        this.localStorageService.set('UserList', userList);
      }
    }
  }

}
