import { Pipe, PipeTransform } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event as AppEvent } from '../models/event.model';

@Pipe({
  name: 'eventTitle'
})
export class EventTitlePipe implements PipeTransform {
  constructor(private eventService: EventsService) {}

  transform(eventId: string): Observable<string> {
    return this.eventService
      .getEvent(eventId)
      .pipe(map((event: AppEvent) => event.title));
  }
}
