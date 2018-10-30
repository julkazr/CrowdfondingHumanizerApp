import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import {
  AngularFireStorage,
  AngularFireUploadTask,
  AngularFireStorageReference
} from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';

@Injectable()
export class FileService {
  constructor(
    @Inject(FirebaseApp) fba: any,
    private _storage: AngularFireStorage
  ) {}

  uploadFile(
    filePath: string,
    file: string
  ): { percentage: Observable<number>; url: Observable<any> } {
    const fileData = file.split(',')[1],
      encoding = file.split(';')[1].split(',')[0],
      contentType = file.split(':')[1].split(';')[0],
      ref = this._storage.ref(filePath),
      task = ref.putString(fileData, encoding, {
        contentType: contentType
      }),
      downloadUrl = new Observable(observer => {
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe(url => {
                if (url && typeof url === 'string') {
                  observer.next(url);
                }
              });
            })
          )
          .subscribe();
      });
    return { percentage: task.percentageChanges(), url: downloadUrl };
  }

  getEventImage(eventId: string): Observable<string> {
    return new Observable(observer => {
      for (const ext of ['png', 'jpg']) {
        this._storage
          .ref(`events/${eventId}/image.${ext}`)
          .getDownloadURL()
          .toPromise()
          .then(downloadURL => observer.next(downloadURL || ''), () => {});
      }
    });
  }

  // Writes the file details to the realtime db
  // private saveFileData(upload: Upload) {
  //   this._db.list(`${this._basePath}/`).push(upload);
  // }
}
