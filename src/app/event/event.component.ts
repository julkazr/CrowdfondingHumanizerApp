import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Event as AppEvent } from '../models/event.model';
import { FileService } from '../services/file.service';
import { DonationsService } from '../services/donations.service';
import { Donation } from '../models/donation.model';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  public event: AppEvent;
  public donation: Donation;
  public donate: Donation;
  public uid: string;
  private eventSub: Subscription;
  public diffDate: number;
  public daysLeftTemp: number;
  public daysLeft: number;
  public donor: Observable<number>;
  public imageURL: Observable<string>;

  constructor(
    private eventServices: EventsService,
    private donateService: DonationsService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.eventSub = this.eventServices
      .getEvent(this.uid)
      .subscribe((event: AppEvent) => {
        this.eventSub.unsubscribe();
        this.event = event;
        this.daysLeft = this.event.timeLeft;
        this.imageURL = this.fileService.getEventImage(this.uid);
        const imgSub = this.imageURL.subscribe(url => {
          imgSub.unsubscribe();
          this.meta.addTags([
            // Facebook tags
            { property: 'og:title', content: event.title },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: location.href },
            { property: 'og:image', content: url },
            {
              property: 'og:description',
              content: event.description.slice(0, 200) + '...'
            },
            { property: 'og:site_name', content: 'Humanizer' },
            // Twitter tags
            { name: 'twitter:card', content: 'summary' },
            {
              name: 'twitter:title',
              content: event.title
            },
            {
              name: 'twitter:description',
              content: event.description.slice(0, 200) + '...'
            },
            { name: 'twitter: image', content: url }
          ]);
        });
      });
    this.donor = this.donateService.getNumberOfDonors(this.uid);
  }

  onSelect(id: string) {
    this.router.navigate(['/donate', id]);
  }
}
