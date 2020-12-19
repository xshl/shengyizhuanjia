import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[hjrPhonePattern]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhonePatternDirective,
      multi: true
    }
  ]
})
export class PhonePatternDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    // console.log(control.value);
    return  phonePatternValidator()(control);
  }
}

export function phonePatternValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
    // 手机验证码的正则式
    const pat = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;  
  　// 手机号码不符合格式，则返回mobilepat的错误
    return !pat.test(control.value) ? {mobilepat: {value: true}} : null;
   };
}
