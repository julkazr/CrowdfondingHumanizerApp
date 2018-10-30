import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  constructor(private afa: AngularFireAuth) {}

  resetPassword(oobCode: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afa.auth
        .verifyPasswordResetCode(oobCode)
        .then(code => {
          this.afa.auth
            .confirmPasswordReset(oobCode, newPassword)
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject();
              throw err;
            });
        })
        .catch(err => {
          reject();
          throw err;
        });
    });
  }
}
