import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event as AppEvent } from '../../models/event.model';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input()
  event: AppEvent;
  public imageURL: Observable<string>;

  @Output()
  openEvent: EventEmitter<string> = new EventEmitter();

  percentage: string;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.imageURL = this.fileService.getEventImage(this.event.id);
  }

  onSelect(eventId: string): void {
    this.openEvent.emit(eventId);
  }
}
