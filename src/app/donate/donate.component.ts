import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events.service';
import { Event as AppEvent } from '../models/event.model';
import { User } from '../models/user.model';
import { Donation } from '../models/donation.model';
import { Subscription } from 'rxjs';
import { DonationsService } from '../services/donations.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  public event: AppEvent;
  private eventSub: Subscription;
  public user = 'anonymous';
  public donation = new Donation();
  public id: string;

  constructor(
    private eventServices: EventsService,
    private donatedServices: DonationsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.eventSub = this.eventServices
      .getEvent(this.id)
      .subscribe((event: AppEvent) => {
        this.eventSub.unsubscribe();
        this.event = event;
        // this.imageURL = this.uploadService.getImageUrl(this.uid);
      });
  }

  onSubmit() {
    const userSub = this.authService
      .getSignedInUser()
      .subscribe(firebaseUser => {
        userSub.unsubscribe();
        this.donation.userId = firebaseUser.uid || '';
        this.donation.eventId = this.event.id;
        this.donation.date = new Date();
        this.donatedServices.createDonation(this.donation);
        this.eventServices.updateEventMoneyCollected(
          this.event.id,
          this.event.moneyCollected + this.donation.donationAmount
        );
        this.router.navigate(['/thanks', this.id]);
      });
  }
}
