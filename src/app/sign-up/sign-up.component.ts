import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { NgForm } from '../../../node_modules/@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: User = new User();
  @ViewChild('signupForm') formDeclaration: NgForm;
  signupForm: NgForm;
  constructor(private _authService: AuthService,
              private _router: Router,
              private _route: ActivatedRoute) {}

  googleSignup() {
    this._authService.signUpWithGoogle(this.user);
    this._router.navigate(['/events']);
  }


  onSubmit() {
    this._authService.signUpWithEmailAndPassword(this.user);
  }

  ngOnInit() {
  console.log('User: ' + this.user);
  }

}
