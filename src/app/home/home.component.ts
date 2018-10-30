import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Event as AppEvent } from '../models/event.model';
import { FileService } from '../services/file.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DonationsService } from '../services/donations.service';
import { Donation } from '../models/donation.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public eventCount = 0;
  public totalmoneyCollecteded = 0;
  public eventsList;
  public event: AppEvent;
  private eventSub: Subscription;
  private donationSub: Subscription;
  public slides: any[];

  constructor(
    private evs: EventsService,
    private ds: DonationsService,
    private _fileService: FileService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.eventSub = this.evs.getData().subscribe(events => {
      this.eventCount = events.length || 0;
      this.eventsList = events;
      this.slides = this.eventsList
        .filter(
          (event: AppEvent) =>
            event.featured && event.state === 'active' && event.timeLeft > 0
        )
        .map(event => {
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            imgURL: this._fileService.getEventImage(event.id)
          };
        });
    });

    this.donationSub = this.ds.getData().subscribe((donations: Donation[]) => {
      this.totalmoneyCollecteded = donations
        .filter((donation: Donation) => donation.userId !== 'HCA')
        .map((donation: Donation) => donation.donationAmount)
        .reduce((a, b) => a + b, 0);
    });
  }
  seeMore(eventId: string) {
    this._router.navigate(['/event', eventId]);
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.donationSub.unsubscribe();
  }
}
