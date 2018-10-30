import { Injectable } from '@angular/core';
import { EventsService } from './events.service';
import { DonationsService } from './donations.service';
import { map, tap } from 'rxjs/operators';
import { Event as AppEvent, stateEnum } from '../models/event.model';
import { Donation } from '../models/donation.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HcaService {
  private stateEnum = stateEnum;
  private paths = {
    events: '/event/',
    donations: '/donation/',
    hca: '/hca/',
    hcaEvents: '/hca/events/'
  };
  private hcaEvents: AngularFireList<AppEvent>;
  private $unsuccessfulEvents: Observable<AppEvent[]>;
  private $hcaDonations: Observable<Donation[]>;
  public hcaFunds: number;

  constructor(
    private db: AngularFireDatabase,
    private evs: EventsService,
    private ds: DonationsService
  ) {
    this.updateEventStatuses();
    this.getFunds().subscribe(hcaFunds => (this.hcaFunds = hcaFunds));
  }

  getHCAEvents(): Observable<AppEvent[]> {
    return this.db
      .list(this.paths.hcaEvents)
      .valueChanges()
      .pipe(
        map((events: AppEvent[]) =>
          events.map((event: AppEvent) => new AppEvent().deserialize(event))
        )
      );
  }

  getHCADonations(): Observable<Donation[]> {
    return this.ds.getUserDonations('HCA').pipe(
      map((donations: Donation[]) =>
        donations.map((donation: Donation) => {
          return new Donation().deserialize(donation);
        })
      )
    );
  }

  getFunds(): Observable<number> {
    return this.db
      .object(this.paths.hca)
      .valueChanges()
      .pipe(map((hca: { funds: number; events: AppEvent[] }) => hca.funds));
  }

  distributeFunds() {
    const evsSub = this.evs.getData().subscribe((events: AppEvent[]) => {
      evsSub.unsubscribe();
      events
        .filter(
          (event: AppEvent) =>
            event.categoryID === 1 && event.state === stateEnum.active
        )
        .sort(
          (a: AppEvent, b: AppEvent) =>
            a.percentCollected > b.percentCollected
              ? 1
              : b.percentCollected > a.percentCollected
                ? -1
                : 0
        )
        .reverse()
        .forEach((event: AppEvent) => {
          console.log(event.title, event.percentCollected);
          if (this.hcaFunds > 0) {
            const donationAmount = this.calcDonation(
              event.moneyGoal,
              event.moneyCollected
            );
            this.ds.createDonation(
              Object.assign(new Donation(), {
                userId: 'HCA',
                eventId: event.id,
                donationAmount: donationAmount,
                donationDate: new Date().getTime()
              })
            );
            this.evs.updateEventMoneyCollected(event.id, donationAmount);
          }
        });
    });
  }

  updateEventStatuses(): void {
    const evSub = this.evs.getData().subscribe((events: AppEvent[]) => {
      evSub.unsubscribe();
      events.forEach((event: AppEvent) => {
        event.updateState();
        this.evs.updateEvent(event);
      });
      events
        .filter((event: AppEvent) => {
          event = new AppEvent().deserialize(event);
          return (
            event.state === stateEnum.unsuccessful && event.categoryID !== 1
          );
        })
        .forEach((event: AppEvent) =>
          this.db.object(this.paths.hcaEvents + event.id).update(event)
        );
      this.calcFunds();
    });
  }

  private calcFunds(): void {
    const eventSub = this.db
      .list(this.paths.hcaEvents)
      .valueChanges()
      .pipe(
        map((events: AppEvent[]) =>
          events.map(
            (event: AppEvent) =>
              new AppEvent().deserialize(event).moneyCollected
          )
        )
      )
      .subscribe((eventDonations: number[]) => {
        eventSub.unsubscribe();
        const donSub = this.getHCADonations()
          .pipe(
            map((donations: Donation[]) =>
              donations
                .map((donation: Donation) => donation.donationAmount)
                .reduce((a, b) => a + b, 0)
            )
          )
          .subscribe((donatedAmount: number) => {
            donSub.unsubscribe();
            this.hcaFunds =
              eventDonations.reduce((a, b) => a + b, 0) - donatedAmount;
            this.db.object(this.paths.hca).update({ funds: this.hcaFunds });
          });
      });
  }

  private calcDonation(
    eventMoneyGoal: number,
    eventMoneyCollected: number
  ): number {
    let donationAmount = 0;
    if (eventMoneyGoal - eventMoneyCollected <= this.hcaFunds) {
      this.hcaFunds -= donationAmount = eventMoneyGoal - eventMoneyCollected;
    } else if (eventMoneyGoal - eventMoneyCollected >= this.hcaFunds) {
      this.hcaFunds -= donationAmount = this.hcaFunds;
    }
    this.db.object(this.paths.hca).update({ funds: this.hcaFunds });
    return donationAmount;
  }
}
