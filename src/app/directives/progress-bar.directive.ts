import { Directive, Input, HostBinding, OnChanges } from '@angular/core';

@Directive({
  selector: '[appProgressBar]'
})
export class ProgressBarDirective implements OnChanges {
  @HostBinding('attr.aria-valuenow')
  @Input()
  appProgressBar: number;
  @HostBinding('style.width')
  barWidth: string;
  @HostBinding('class.bg-success')
  private greenBar: boolean;
  @HostBinding('class.bg-primary')
  private blueBar: boolean;
  @HostBinding('class.bg-warning')
  private yellowBar: boolean;
  @HostBinding('class.bg-secondary')
  private greyBar: boolean;

  ngOnChanges() {
    this.classEval();
  }

  private classEval() {
    this.barWidth = this.appProgressBar + '%';
    if (this.appProgressBar >= 80) {
      this.greenBar = true;
      this.blueBar = this.yellowBar = this.greyBar = false;
    } else if (this.appProgressBar >= 60) {
      this.blueBar = true;
      this.greenBar = this.yellowBar = this.greyBar = false;
    } else if (this.appProgressBar >= 20) {
      this.yellowBar = true;
      this.greenBar = this.blueBar = this.greyBar = false;
    } else {
      this.greyBar = true;
      this.greenBar = this.blueBar = this.yellowBar = false;
    }
  }
}
