import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[xslConfirm]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmDirective,
      multi: true
    }
  ]
})
export class ConfirmDirective implements Validator{
  @Input('xslConfirm') confirm: string;
  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    return this.confirm ? confirmValidator(this.confirm)(control) : null;
    // throw new Error('Method not implemented.');
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method notA implemented.');
  // }

}

export function confirmValidator(confirm: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => { // 传入绑定表单的formControl
    if ( !control.value ) { // 如果绑定未输入值，则返回 required错误
     return {required: true };
    }
  　// 如果两次输入的值不相同，则返回confirm的错误
    return control.value !== confirm ? {confirm: {value: true}} : null;
   };
}
