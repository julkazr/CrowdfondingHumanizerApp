import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnChanges {
  public badgeLevel: string;
  private path = 'assets/badges/';
  public show = true;
  @Input()
  private donation: number;

  constructor() {}

  ngOnChanges() {
    if (this.donation >= 800) {
      this.badgeLevel = this.path + `platinum.svg`;
    } else if (this.donation >= 250) {
      this.badgeLevel = this.path + `gold.svg`;
    } else if (this.donation >= 100) {
      this.badgeLevel = this.path + `silver.svg`;
    } else if (this.donation >= 40) {
      this.badgeLevel = this.path + `bronze.svg`;
    } else {
      this.show = false;
    }
  }
}
