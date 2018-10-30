import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { EventsService } from '../services/events.service';
import { Event as AppEvent } from '../models/event.model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'eventStatus'
})
export class EventStatusPipe implements PipeTransform {
  constructor(private eventService: EventsService) {}

  transform(eventId: string): Observable<string> {
    return this.eventService
      .getEvent(eventId)
      .pipe(map((event: AppEvent) => event.state));
  }
}
