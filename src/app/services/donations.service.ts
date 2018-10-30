import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Donation } from '../models/donation.model';
import { map, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private donationList: AngularFireList<Donation>;
  private path = '/donations/';
  public donationNumber = 0;

  constructor(private db: AngularFireDatabase) {
    this.getData();
  }

  getData(): Observable<Donation[]> {
    this.donationList = this.db.list(this.path);
    return this.donationList
      .valueChanges()
      .pipe(
        map((donats: Donation[]) =>
          donats.map((donat: Donation) => new Donation().deserialize(donat))
        )
      );
  }

  getNumberOfDonors(eventId: string) {
    const counter = {};
    return this.db
      .list(this.path)
      .valueChanges()
      .pipe(
        map((donations: Donation[]) => {
          donations
            .filter((donation: Donation) => donation.eventId === eventId)
            .map((donation: Donation) => donation.userId)
            .forEach(id => {
              counter[id] = counter[id] ? counter[id] + 1 : 1;
            });
          return counter[''] + Object.values(counter).length - 1 || 0;
        })
      );
  }

  getEventDonations(eventId: string): Observable<Donation[]> {
    return this.donationList
      .valueChanges()
      .pipe(
        map((donations: Donation[]) =>
          donations.filter((donation: Donation) => donation.eventId === eventId)
        )
      );
  }

  getUserDonations(userId: string): Observable<any[]> {
    return this.db
      .list(this.path, ref => ref.orderByChild('userId').equalTo(userId))
      .valueChanges();
  }
  // ovo je upis na bazu ako se ne traži nazad id
  // createDonation(donation: Donation): void {
  // this.db.object(`donations/${donation.id}`).set(donation);
  // }

  createDonation(donation: Donation) {
    if (!this.donationList) {
      this.getData();
    }
    return this.donationList.push(donation).then(promise => {
      this.db.object(this.path + promise.key).update({
        id: promise.key
        // donatedDate: donation.donatedDate.getTime()
      });
      return promise.key;
    });
  }
}
