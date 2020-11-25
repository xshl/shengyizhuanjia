import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCodeServiceService {

  // 用于保存验证码
  private code: string;
  // 存放验证码的过期时间
  private deadline: number;
  // url中的random 字段的值
  private strRand = Math.floor(Math.random() * 10000000000);
  // 时间戳
  private now = Math.floor(Date.now() / 1000);
  constructor(private httpClient: HttpClient) {
    this.code = '';
  }

  /*
   * 生成验证码
   * @param {number} [count=4]  验证码位数，默认4位
   * @param {number} [timeout=10] 超过时间，默认10分钟
   * @return {*}  {string}  验证码
   * @memberof AuthenticationCodeServiceService
   */
  createCode(count: number = 4, timeout: number = 10): string{
    this.code = '';
    // 10分钟内有效
    this.deadline = Date.now() + 60 * timeout * 1000;
    for (let i = 0; i < count; i++) {
      // 生成随机数
      this.code = `${this.code}${Math.floor(Math.random() * 10)}`;
    }
    return this.code;
  }

  /*
   * 验证用户输入的短信验证码是否一致，是否过期
   * @param {string} value  验证码的值
   * @return {*}  {boolean} 是否一致，是否过期
   * @memberof AuthenticationCodeServiceService
   */
  validate(value: string): boolean{
    const now = Date.now();
    return (value === this.code) && (now <= this.deadline);
  }

  /*
   * 发送验证码
   * @param {string} phone  电话号码
   * @memberof AuthenticationCodeServiceService
   */
  sendSms(phone: string): void {
    this.deadline = Date.now() + 60 * 10 * 1000;
    const strSig = 'appkey= ' + '&random=' + this.strRand + '&time=' + this.now + '&mobile=' + phone;
    // let url = '/api' + '?sdkappid=' + this.sdkAppId + '&random=' + this.strRand;
    const url = 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=1400452227' + '&random=' + this.strRand;
    const sig = CryptoJS.SHA256(strSig) + '';
    // const sig = Md5.hashStr(strSig) + '';
    console.log('验证码：' + this.code);
    this.httpClient.post(url, {
        ext: '',
        extend: '',
        sdkappid: '1400452227',
        params: [
            this.code,
        ],
        sig,
        sign: '生意专家fzu',
        tel: {
            mobile: phone,
            nationcode: '86'
        },
        time: this.now,
        tpl_id: 781551
    }).toPromise().then(response => {
        const res = response;
        console.log(res);
    });

   }
}
