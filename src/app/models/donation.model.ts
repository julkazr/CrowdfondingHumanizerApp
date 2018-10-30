import { Deserializable } from './deserialize.model';

export class Donation implements Deserializable {
  id?: string;
  userId?: string;
  eventId: string;
  donationAmount: number;
  private donationDate: number;

  constructor() {}

  deserialize(obj: any): this {
    Object.assign(this, obj);
    return this;
  }

  get date(): Date {
    return new Date(this.donationDate);
  }

  set date(donationDate: Date) {
    this.donationDate = donationDate.getTime();
  }
}
