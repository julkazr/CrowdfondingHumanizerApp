import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../models/user.model';
import { Subscription, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private _db: AngularFireDatabase) {}
  user: User;
  private _isAdmin: Observable<boolean>;
  createUser(newUser: User): void {
    this._db.object(`users/${newUser.id}`).set(newUser);
  }

  updateUserStatus(useruid, status): void {
    const firebaseDbSuscription: Subscription = this._db
      .object(`users/${useruid}`)
      .valueChanges()
      .subscribe((user: User) => {
        user.status = status;
        this._db.object(`users/${user.id}`).update(user);
        firebaseDbSuscription.unsubscribe();
        // console.log(user);
      });
  }

  getUserByUID(userUID: string): Observable<User> {
    return this._db.object(`users/${userUID}`).valueChanges();
  }

  updateUserData(userUID: string, newData: {}) {
    this._db.object(`users/${userUID}`).update(newData);
  }
}
