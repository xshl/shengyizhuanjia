import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[xslPasswordPattern]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordPatternDirective,
      multi: true
    }
  ]
})
export class PasswordPatternDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    // console.log(control.value);
    return  passwordPatternValidator()(control);
    // throw new Error('Method not implemented.');
  }

}

export function passwordPatternValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
    // 密码的正则式
    const pat = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/;
    // 可以用console.log记录实时过程中的值。
    // console.log(pat.test(control.value));
  　// 如果密码不符合格式，则返回confirm的错误
    return !pat.test(control.value) ? {pattern: {value: true}} : null;
   };
}

