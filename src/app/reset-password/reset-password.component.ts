import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public feedback: string;
  public error: Error;
  private oobCode: string;

  @ViewChild('passwordReset')
  passwordReset: NgForm;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rps: ResetPasswordService
  ) {}

  ngOnInit() {
    const paramSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        paramSub.unsubscribe();
        this.oobCode = params['oobCode'];
      }
    );
  }

  onSubmit() {
    if (this.passwordReset.invalid) {
      this.passwordReset.control.markAsTouched();
    } else {
      this.rps
        .resetPassword(
          this.oobCode,
          this.passwordReset.controls['resetPassword'].value
        )
        .then(() => this.router.navigate(['/sign-in']))
        .catch(err => (this.error = err));
    }
  }
}
