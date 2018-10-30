import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('passwordReset')
  passwordReset: NgForm;
  public feedback: string;
  public error: Error;

  constructor(private fps: ForgotPasswordService) {}

  ngOnInit() {}

  onSubmit() {
    const email = this.passwordReset.controls['resetEmail'];
    email.markAsDirty();
    if (email.value && email.valid) {
      this.fps
        .resetPassword(email.value)
        .then(() => (this.feedback = 'Password reset link sent'))
        .catch(err => (this.error = err));
    }
  }
}
