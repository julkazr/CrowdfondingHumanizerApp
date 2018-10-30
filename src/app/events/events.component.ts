import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { Event as AppEvent } from '../models/event.model';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CATEGORIES } from '../app-data/categories';
import { find, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @ViewChild('filterForm')
  filterForm: NgForm;
  public eventsList: Observable<AppEvent[]>;
  public categories = CATEGORIES;
  public sortBy = 'startDate';
  public filterByState = '';
  public ascending = true;
  public onlyCurrent = true;
  public p: any;

  constructor(
    private eventsListServices: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventsListServices.calcDonations();
    this.getEvents();
  }

  log(whatever: any) {
    window.console.log(whatever);
  }

  getEvents() {
    this.eventsList = this.eventsListServices.getData();
  }

  openEvent(eventId: string): void {
    this.router.navigate(['/event', eventId]);
  }

  toggleAscending() {
    this.ascending = !this.ascending;
  }

  setClasses(value: boolean) {
    return { 'bg-success': value, 'text-white': value };
  }

  onlyCurrentFunc() {
    this.onlyCurrent = !this.onlyCurrent;
  }
}
