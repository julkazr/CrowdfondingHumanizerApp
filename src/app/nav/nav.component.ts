import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  public signedIn: Observable<boolean>;
  public isAdmin: Observable<boolean>;
  public user: firebase.User;
  private userSub: Subscription;

  constructor(private authServ: AuthService) {}

  ngOnInit() {
    this.signedIn = this.authServ.routeProtected();
    this.isAdmin = this.authServ.isUserAdmin();
    this.userSub = this.authServ.getSignedInUser().subscribe(firebaseUser => {
      this.user = firebaseUser;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  signOut() {
    this.authServ.signOut();
  }
}
