import {
  Directive,
  HostBinding,
  Inject,
  forwardRef,
  DoCheck
} from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appIsInvalid]'
})
export class IsInvalidDirective implements DoCheck {
  @HostBinding('class.is-invalid')
  isInvalid: boolean;

  constructor(
    @Inject(forwardRef(() => NgModel)) private inputToCheck: NgModel
  ) {
    this.isInvalid = false;
  }

  ngDoCheck() {
    this.checkIfInvalid();
  }

  private checkIfInvalid(): void {
    this.isInvalid =
      (this.inputToCheck.touched || this.inputToCheck.dirty) &&
      this.inputToCheck.invalid;
  }
}
