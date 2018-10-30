import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import * as firebase from 'firebase';
import { CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public user: firebase.User;
  public userData: User;
  public selectedFile: string = null;
  public percent: number;
  public done = false;
  public imageURL = 'assets/avatar.png';
  public newPassword = '';
  public currentPassword = '';
  public newEmail: string;
  public userProfileName: string;
  public subscribedToNewsletter: boolean;
  public cropperSettings: CropperSettings;

  @ViewChild('profileInfo')
  profileInfo: NgForm;
  @ViewChild('accountInfo')
  accountInfo: NgForm;

  constructor(
    private _fileService: FileService,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    this.cropperSettings = Object.assign(new CropperSettings(), {
      canvasHeight: 200,
      canvasWidth: 200,
      width: 100,
      height: 100,
      croppedHeight: 200,
      croppedWidth: 200
    });
  }

  ngOnInit() {
    this._authService.getSignedInUser().subscribe(firebaseUser => {
      this.user = firebaseUser;
      this.imageURL = firebaseUser.photoURL;
      this.newEmail = firebaseUser.email;
      this.userProfileName = firebaseUser.displayName;
      this._userService.getUserByUID(this.user.uid).subscribe(userData => {
        this.userData = userData;
      });
    });
  }

  updateProfile() {
    let task = null;
    if (this.selectedFile) {
      const fileType = this.selectedFile.split('/')[1].split(';')[0];
      task = this._fileService.uploadFile(
        `users/${this.user.uid}/avatar.${fileType}`,
        this.selectedFile
      );
      task.percentage.subscribe(percent => (this.percent = percent));
    }

    if (task) {
      task.url.subscribe(url => {
        this.user.updateProfile({
          displayName: this.userProfileName || this.user.displayName,
          photoURL: url || this.user.photoURL
        });
        this.done = true;
        this.imageURL = url;
      });
    } else {
      this.user.updateProfile({
        displayName: this.userProfileName || this.user.displayName,
        photoURL: this.user.photoURL
      });
    }
  }

  updateAccount() {
    if (!this.currentPassword || this.currentPassword.length === 0) {
      this.accountInfo.controls['password'].markAsTouched();
    }
    if (!this.accountInfo.invalid) {
      if (this.newEmail) {
        this._authService.updateEmail(this.newEmail, this.currentPassword);
      }
      if (this.newPassword && this.accountInfo.controls['password'].valid) {
        this._authService.updatePassword(
          this.currentPassword,
          this.newPassword
        );
      }
      this.accountInfo.resetForm({ email: this.user.email });
    }
  }

  onFileSelected(file: string) {
    // console.log(file);
    this.selectedFile = file;
  }

  getDateOfBirth(dateStatus: Date) {
    this._userService.updateUserData(this.user.uid, {
      dateOfBirth: dateStatus
    });
  }

  newsletterSubscription(subscriptionStatus: boolean) {
    this._userService.updateUserData(this.user.uid, {
      isNewsletterFieldChecked: subscriptionStatus
    });
  }
}
