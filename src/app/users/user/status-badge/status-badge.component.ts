import { Component, Input, OnInit } from '@angular/core';
import { stateEnum } from '../../../models/event.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent implements OnInit {
  private statusEnum = stateEnum;

  @Input()
  eventStatus: string;

  constructor() {}

  ngOnInit() {}

  setClasses() {
    return {
      'badge-primary': this.eventStatus === 'active',
      'badge-success': this.eventStatus === 'successful',
      'badge-warning': this.eventStatus === 'unsuccessful',
      'badge-secondary': this.eventStatus === 'archived'
    };
  }
}
