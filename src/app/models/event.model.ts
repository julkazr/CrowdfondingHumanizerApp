import { Deserializable } from './deserialize.model';

export class Event implements Deserializable {
  private _id?: string;
  private _title: string;
  private _description: string;
  private _startDate: number;
  private _duration: number;
  private _state: string;
  private _moneyGoal: number;
  private _moneyCollected: number;
  private _categoryID: number;
  private _featured: boolean;
  private _ownerID?: string;
  private _dateEnded?: number;

  constructor() {}

  deserialize(obj: Event): this {
    Object.assign(this, obj);
    return this;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  set startDate(startDate: Date) {
    this._startDate = startDate.getTime();
  }

  get duration(): number {
    return this._duration;
  }

  set duration(duration: number) {
    this._duration = duration;
  }

  get moneyGoal(): number {
    return this._moneyGoal;
  }

  set moneyGoal(moneyGoal: number) {
    this._moneyGoal = moneyGoal;
  }

  get categoryID(): number {
    return this._categoryID;
  }

  set categoryID(categoryID: number) {
    this._categoryID = categoryID;
  }

  get featured(): boolean {
    return this._featured;
  }

  set featured(featured: boolean) {
    this._featured = featured;
  }

  get state(): string {
    return stateEnum[this._state];
  }

  set state(state: string) {
    this._state = stateEnum[state];
  }

  get moneyCollected(): number {
    return this._moneyCollected;
  }

  set moneyCollected(moneyCollected: number) {
    this._moneyCollected = moneyCollected;
  }

  get ownerID(): string {
    return this._ownerID;
  }

  set ownerID(ownerID: string) {
    this._ownerID = ownerID;
  }

  get dateEnded(): Date {
    return new Date(this._dateEnded);
  }

  set dateEnded(dateEnded: Date) {
    this._dateEnded = dateEnded.getTime();
  }

  get timeLeft(): number {
    return Math.max(
      Math.round(
        (this._startDate + this._duration - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      0
    );
  }

  get percentCollected(): number {
    return (this._moneyCollected / this._moneyGoal) * 100;
  }

  updateState(): void {
    if (
      this._moneyCollected / this._moneyGoal >= 1 &&
      this._state !== stateEnum.successful
    ) {
      this._state = stateEnum.successful;
      this.dateEnded = new Date();
    }
    if (
      this._moneyCollected / this._moneyGoal < 1 &&
      this.timeLeft <= 0 &&
      this._state !== stateEnum.unsuccessful
    ) {
      this._state = stateEnum.unsuccessful;
      this.dateEnded = new Date();
    }
    if (this._state === stateEnum.created && this.timeLeft > 0) {
      this._state = stateEnum.active;
    }
  }
}

export enum stateEnum {
  'created' = 'created',
  'invalid' = 'invalid',
  'active' = 'active',
  'successful' = 'successful',
  'unsuccessful' = 'unsuccessful',
  'archived' = 'archived'
}
