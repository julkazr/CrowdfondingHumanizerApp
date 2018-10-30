import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseApp } from 'angularfire2';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  constructor(@Inject(FirebaseApp) fba: any) {}

  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }
}
