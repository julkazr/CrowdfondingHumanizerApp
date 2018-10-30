import { Component, OnInit } from '@angular/core';
import { Event as AppEvent, stateEnum } from '../models/event.model';
import { CATEGORIES } from '../app-data/categories';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { FileService } from '../services/file.service';
import { finalize, map } from 'rxjs/operators';
import { CropperSettings } from 'ng2-img-cropper';
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  public categories = CATEGORIES;
  public event = new AppEvent();
  public duration = 1;
  public selectedFile: string = null;
  public percent: number;
  public done = false;
  public imageURL = 'assets/Social_Event.jpg';
  public featured = false;
  private stateEnum = stateEnum;
  public cropperSettings: CropperSettings;
  // currentDay: string = new Date().toISOString().slice(0, 10);
  public digit = 1;
  public pluralMapping = {
    1: 'createEvent.week1',
    2: 'createEvent.week2',
    0: 'createEvent.weeks'
  };

  constructor(
    private evs: EventsService,
    private router: Router,
    private _fileService: FileService
  ) {
    this.cropperSettings = Object.assign(new CropperSettings(), {
      canvasHeight: 200,
      canvasWidth: 356,
      dynamicSizing: true,
      width: 200,
      height: 112,
      croppedHeight: 720,
      croppedWidth: 1280,
      fileType: 'image/jpeg'
    });
  }

  ngOnInit() {
    this.event.duration = 1;
    console.log(this.categories);
  }

  onFileSelected(event: any) {
    this.selectedFile = event;
  }

  calcCount(): void {
    this.digit = this.duration % 10;

    if (this.duration < 10 || this.duration > 19) {
      switch (this.digit) {
        case 1:
          this.digit = 1;
          break;
        case 2:
        case 3:
        case 4:
          this.digit = 2;
          break;
        default:
          this.digit = 0;
          break;
      }
    } else {
      this.digit = 0;
    }
  }

  onSubmit() {
    this.event.state = stateEnum['created'];
    this.event.moneyCollected = 0;
    this.event.duration = this.duration * 7 * 24 * 60 * 60 * 1000;
    this.event.featured = this.featured;
    this.event.startDate = new Date();
    window.console.log(this.event);
    const fileType = this.selectedFile.split('/')[1].split(';')[0];
    this.evs.createEvent(this.event).then(id => {
      console.log(id);
      const task = this._fileService.uploadFile(
        `events/${id}/image.${fileType}`,
        this.selectedFile
      );
      task.percentage
        .subscribe(percent => this.percent = percent);
      task.url
        .subscribe(url => {
          console.log(url);
         if (typeof url === 'string') {
           this.router.navigate(['/event', id]);
          }
        });
    });
  }
}
