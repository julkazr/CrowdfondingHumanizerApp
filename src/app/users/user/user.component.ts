import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DonationsService } from '../../services/donations.service';
import { Donation } from '../../models/donation.model';
import { Observable, Subscription } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { Event as AppEvent } from '../../models/event.model';
import { map, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  public user: firebase.User;
  public userDonations: Observable<any[]>;
  public userEvents: Observable<AppEvent[]>;
  public totalDonations: Observable<number>;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private donationService: DonationsService,
    private eventService: EventsService
  ) {}

  ngOnInit() {
    this.userSub = this.authService
      .getSignedInUser()
      .subscribe(firebaseUser => {
        this.user = firebaseUser;
        this.userDonations = this.donationService
          .getUserDonations(firebaseUser.uid)
          .pipe(
            map((donations: Donation[]) => {
              const donationList = [];
              donations.forEach((donation: Donation) => {
                donation = new Donation().deserialize(donation);
                if (!donationList[donation.eventId]) {
                  donationList[donation.eventId] = 0;
                }
                donationList[donation.eventId] += donation.donationAmount;
              });
              console.log(donationList);
              return donationList;
            })
          );
        this.totalDonations = this.userDonations.pipe(
          map(donations => Object.values(donations).reduce((a, b) => a + b, 0))
        );
        this.userEvents = this.eventService.getUserEvents(firebaseUser.uid);
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
