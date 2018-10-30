import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, EmailValidator } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  user: User = new User();
  @ViewChild('signInForm')
  signInForm: NgForm;
  constructor(private _authService: AuthService, private _router: Router) {}
  public email: string;
  public password: string;
  public error: Error;

  signIn() {
    this._authService
      .signInWithEmailAndPassword(this.email, this.password)
      .catch(err => (this.error = err));
  }

  googleSignin() {
    this._authService.signUpWithGoogle(this.user);
    this._router.navigate(['/events']);
  }

  // rememberMe() {}

  ngOnInit() {}
}
