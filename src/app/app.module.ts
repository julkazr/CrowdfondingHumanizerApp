import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ShareModule } from '@ngx-share/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperModule } from 'ng2-img-cropper';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { AppRouterModule } from './app.routing';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { EventsComponent } from './events/events.component';
import { EventCardComponent } from './events/event-card/event-card.component';
import { EventComponent } from './event/event.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { EqualStringsDirective } from './directives/equal-strings.directive';
import { IsInvalidDirective } from './directives/is-invalid.directive';
import { CreateEventComponent } from './create-event/create-event.component';
import { ProgressBarDirective } from './directives/progress-bar.directive';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { FileService } from './services/file.service';
import { UserComponent } from './users/user/user.component';
import { FeedbackErrorDirective } from './directives/feedback-error.directive';
import { BadgeComponent } from './users/user/badge/badge.component';
import { SortAndFilterPipe } from './pipes/sort-and-filter.pipe';
import { DonateComponent } from './donate/donate.component';
import { ThanksComponent } from './thanks/thanks.component';
import { EmailVerificationComponent } from './sign-up/email-verification.component';
import { EventTitlePipe } from './pipes/event-title.pipe';
import { StatusBadgeComponent } from './users/user/status-badge/status-badge.component';
import { EventStatusPipe } from './pipes/event-status.pipe';
import { ImageUploadComponent } from './shared/image-upload/image-upload.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CommunityAccountComponent } from './community-account/community-account.component';
import { FirstNamePipe } from './pipes/first-name.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    EventsComponent,
    EventCardComponent,
    EventComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    SignInComponent,
    EqualStringsDirective,
    IsInvalidDirective,
    CreateEventComponent,
    ProgressBarDirective,
    EditUserComponent,
    UserComponent,
    FeedbackErrorDirective,
    BadgeComponent,
    SortAndFilterPipe,
    DonateComponent,
    ThanksComponent,
    EmailVerificationComponent,
    EventTitlePipe,
    StatusBadgeComponent,
    EventStatusPipe,
    ImageUploadComponent,
    ResetPasswordComponent,
    CommunityAccountComponent,
    FirstNamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRouterModule,
    Angular2FontawesomeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    AngularFireStorageModule,
    ShareModule.forRoot(),
    NgxPaginationModule,
    ImageCropperModule
  ],
  providers: [AuthService, UserService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule {}
