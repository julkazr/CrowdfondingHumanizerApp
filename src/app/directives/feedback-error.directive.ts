import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appFeedbackError]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: FeedbackErrorDirective, multi: true }
  ]
})
export class FeedbackErrorDirective implements OnChanges {
  @Input()
  appFeedbackError: Error;

  private _onChange: () => void;

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('appFeedbackError' in changes) {
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  validate(): { [key: string]: any } | null {
    if (this.appFeedbackError) {
      return { feedbackError: true };
    } else {
      return null;
    }
  }
}
