import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, NgModel, AbstractControl } from '../../../node_modules/@angular/forms';

@Directive({
  selector: '[appEqualStrings]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EqualStringsDirective, multi: true}]
})
export class EqualStringsDirective {

  // tslint:disable-next-line:no-input-rename
  @Input ('appEqualStrings') inputComparator: NgModel;
  @Input ('isReverseField') isReverseField: boolean;
  validate(inputToCompare: AbstractControl): {[key: string]: any} {
    if (inputToCompare.value && this.isReverseField) {
      this.inputComparator.control.updateValueAndValidity();
    } else {
      if (inputToCompare.value && inputToCompare.value.localeCompare(this.inputComparator.value) !== 0) {
        return {'strNotEqual': true};
      } else {
        return null;
      }
    }
  }
}
