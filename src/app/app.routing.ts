import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { UserAuthenticatedGuard } from './guard/user-authenticated.guard';
import { UserComponent } from './users/user/user.component';
import { IsUserVerifiedGuard } from './guard/is-user-verified.guard';
import { DonateComponent } from './donate/donate.component';
import { ThanksComponent } from './thanks/thanks.component';
import { EmailVerificationComponent } from './sign-up/email-verification.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CommunityAccountComponent } from './community-account/community-account.component';
import { AdminUserGuard } from './guard/admin-user.guard';

const APP_ROUTES: Routes = [
  { path: 'events', component: EventsComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'email-verification', component: EmailVerificationComponent },
  { path: 'register', redirectTo: 'sign-up' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'login', redirectTo: 'sign-in' },
  {
    path: 'create-event',
    component: CreateEventComponent,
    canActivate: [UserAuthenticatedGuard /*, IsUserVerifiedGuard*/]
  },
  {
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [UserAuthenticatedGuard]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserAuthenticatedGuard]
  },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'donate/:id', component: DonateComponent },
  { path: 'thanks/:id', component: ThanksComponent },
  {
    path: 'community-account',
    component: CommunityAccountComponent,
    canActivate: [UserAuthenticatedGuard, AdminUserGuard]
  },
  { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRouterModule {}
