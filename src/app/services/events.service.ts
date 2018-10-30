import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Event as AppEvent } from '../models/event.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DonationsService } from './donations.service';
import { Donation } from '../models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private eventList: AngularFireList<AppEvent>;
  private path = '/event/';
  // private filtredCategoryId: [];

  constructor(
    private firebase: AngularFireDatabase,
    private ds: DonationsService
  ) {
    this.getData();
    this.calcDonations();
  }

  getData(): Observable<AppEvent[]> {
    this.eventList = this.firebase.list(this.path);
    return this.eventList
      .valueChanges()
      .pipe(
        map((events: AppEvent[]) =>
          events.map((event: AppEvent) => new AppEvent().deserialize(event))
        )
      );
  }

  getEvent(uid: string): Observable<AppEvent> {
    return this.firebase
      .object(this.path + uid)
      .valueChanges()
      .pipe(map((event: AppEvent) => new AppEvent().deserialize(event)));
  }

  // getEventsByCategory(categoryID?: number) {
  //   if (categoryID) {
  //     this.eventList = this.firebase.list(this.path, ref =>
  //       ref.orderByChild('_categoryID').equalTo(categoryID)
  //     );
  //   } else {
  //     this.eventList = this.firebase.list(this.path);
  //   }
  //   return this.eventList;
  // }

  createEvent(event: AppEvent) {
    if (!this.eventList) {
      this.getData();
    }
    return this.eventList.push(event).then(promise => {
      this.firebase.object(this.path + promise.key).update({
        _id: promise.key
        // _startDate: event.startDate.getTime()
      });
      return promise.key;
    });
  }

  updateEvent(eventData: AppEvent): void {
    // console.log(eventData.title, eventData.moneyCollected);
    this.firebase.object(this.path + eventData.id).update(eventData);
  }

  updateEventMoneyCollected(id: string, money: number) {
    this.firebase.object(this.path + id).update({
      _moneyCollected: money
    });
  }

  getUserEvents(userID: string): Observable<AppEvent[]> {
    return this.firebase
      .list(this.path, ref => ref.orderByChild('_ownerID').equalTo(userID))
      .valueChanges()
      .pipe(
        map((events: AppEvent[]) =>
          events.map((event: AppEvent) => new AppEvent().deserialize(event))
        )
      );
  }

  calcDonations(): void {
    const eventSub = this.eventList
      .valueChanges()
      .subscribe((events: AppEvent[]) => {
        eventSub.unsubscribe();
        events.forEach((event: AppEvent) => {
          event = new AppEvent().deserialize(event);
          const donSub = this.ds
            .getEventDonations(event.id)
            .subscribe((donations: Donation[]) => {
              donSub.unsubscribe();
              event.moneyCollected = donations
                .map((donation: Donation) => donation.donationAmount)
                .reduce((a, b) => a + b, 0);
              this.updateEvent(event);
            });
        });
      });
  }

  // updateEvent(event: Event) {
  //   this.eventList.update(event.id, {
  //     id: event.id,
  //     title: event.title,
  //     description: event.description,
  //     startDate: event.startDate,
  //     endDate: event.endDate,
  //     state: event.state,
  //     moneyGoal: event.moneyGoal,
  //     moneyCollected: event.moneyCollected,
  //     categoryID: event.categoryID
  //   });
  // }

  // deleteEvent(id: string) {
  //   this.eventList.remove(id);
  // }
}
