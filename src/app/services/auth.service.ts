import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from '../../../node_modules/firebase';
import { UserService } from './user.service';
import { User, UserStatus } from '../models/user.model';
import { reject, resolve } from 'q';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authorizeRoute$: Observable<boolean>;
  private _signedInUser$: Observable<firebase.User>;
  public signedInUser: firebase.User;
  private _userVerified: Observable<boolean>;
  public userData: User;

  constructor(
    private _userService: UserService,
    private _afAuth: AngularFireAuth,
    private _router: Router,
    private _location: Location
  ) {
    this.tryToGetLoggedInUser();
    this.authorizeUser();
  }

  signUpWithGoogle(newUser) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this._afAuth.auth.signInWithRedirect(provider).then(result => {
      const afSubscription: Subscription = this._afAuth.authState.subscribe(
        firebaseUser => {
          afSubscription.unsubscribe();
          this.signedInUser = firebaseUser;
          this._router.navigate(['/events']);
        }
      );
    });
  }

  signUpWithEmailAndPassword(newUser: User) {
    this._afAuth.auth
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(firebaseResponse => {
        const user = firebaseResponse.user;
        newUser.id = user.uid;
        user.updateProfile({
          displayName: newUser.name,
          photoURL: 'assets/avatar.png'
        });
        user
          .sendEmailVerification()
          .then(resp => this._router.navigate(['/email-verification']))
          .catch(err => err.message);
        delete newUser.password;
        this._userService.createUser(newUser);
      })
      .catch();
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    return this._afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        const afSubscription: Subscription = this._afAuth.authState.subscribe(
          firebaseUser => {
            afSubscription.unsubscribe();
            this.signedInUser = firebaseUser;
            this._userService.updateUserStatus(
              firebaseUser.uid,
              UserStatus.Online
            );
            this._router.navigate(['/events']);
          }
        );
      });
  }

  getSignedInUser() {
    return this._signedInUser$;
  }

  private authorizeUser(): void {
    this._authorizeRoute$ = new Observable(observer => {
      this._afAuth.authState.subscribe(firebaseUser => {
        if (firebaseUser) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

  private verifiedUser(): void {
    this._userVerified = new Observable(observer => {
      const sub = this._afAuth.authState.subscribe(firebaseUser => {
        sub.unsubscribe();
        if (firebaseUser && firebaseUser.sendEmailVerification) {
          observer.next(true);
        } else {
          observer.next(false);
          this._location.back();
        }
      });
    });
  }

  public isUserVerified(): Observable<boolean> {
    return this._userVerified;
  }

  tryToGetLoggedInUser(logoutInitiated?: boolean): void {
    this._signedInUser$ = new Observable(observer => {
      this._afAuth.authState.subscribe(firebaseUser => {
        if (firebaseUser) {
          this._userService.updateUserStatus(
            firebaseUser.uid,
            UserStatus.Online
          );
          observer.next(firebaseUser);
          // const sub: Subscription = this._userService.getUserByUID(firebaseUser.uid).subscribe((user) => {
          // sub.unsubscribe();
          // observer.next(user);
          // console.log(firebaseUser);
          // });
        } else {
          observer.next(null);
        }
      });
    });
  }

  routeProtected(): Observable<boolean> {
    return this._authorizeRoute$;
  }

  public isUserAdmin(): Observable<boolean> {
    return new Observable(observer => {
      const afaSub = this._afAuth.authState.subscribe(firebaseUser => {
        afaSub.unsubscribe();
        const sub = this._userService
          .getUserByUID(firebaseUser.uid)
          .subscribe((userData: User) => {
            sub.unsubscribe();
            if (userData.isAdmin) {
              observer.next(userData.isAdmin);
            } else {
              observer.next(false);
            }
          });
      });
    });
  }

  public updatePassword(password: string, newPassword: string): void {
    const sub = this._afAuth.authState.subscribe(firebaseUser => {
      sub.unsubscribe();
      firebaseUser
        .reauthenticateAndRetrieveDataWithCredential(
          firebase.auth.EmailAuthProvider.credential(
            firebaseUser.email,
            password
          )
        )
        .then(fbRe => {
          fbRe.user
            .updatePassword(newPassword)
            .then(() =>
              this._afAuth.auth.signInWithEmailAndPassword(
                fbRe.user.email,
                newPassword
              )
            )
            .catch(err => console.error(err.message));
        });
    });
  }

  public updateEmail(newEmail: string, password: string) {
    const sub = this._afAuth.authState.subscribe(firebaseUser => {
      sub.unsubscribe();
      if (newEmail === firebaseUser.email) {
        return;
      }
      firebaseUser
        .reauthenticateAndRetrieveDataWithCredential(
          firebase.auth.EmailAuthProvider.credential(
            firebaseUser.email,
            password
          )
        )
        .then(fbRe => {
          window.console.log(newEmail);
          fbRe.user.updateEmail(newEmail).catch(err => err);
        });
    });
  }

  public updateDisplayName(newName) {
    const sub = this._afAuth.authState.subscribe(firebaseUser => {
      sub.unsubscribe();
      firebaseUser.updateProfile({
        displayName: newName,
        photoURL: firebaseUser.photoURL
      });
    });
  }

  signOut(): void {
    this._afAuth.auth.signOut();
    this._router.navigate(['/']);
  }
}
