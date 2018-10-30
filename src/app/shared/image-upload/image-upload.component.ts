import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { NgModel, ControlContainer, NgForm } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ImageUploadComponent implements OnChanges {
  public selectedFile: File;
  public outputFile: File;
  public data: any;

  @Input()
  public imageUrl: string;
  @Input()
  public cropperSettings: CropperSettings;
  @Input()
  public rounded = false;
  @Input()
  public percent: number;
  @Input()
  public done: boolean;

  @Output()
  public uploadImage: EventEmitter<string> = new EventEmitter();

  @ViewChild('imagePreview')
  imagePreview;
  @ViewChild('fileSelect')
  fileSelect: NgModel;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor() {
    this.data = {};
  }

  ngOnChanges() {
    this.cropperSettings.noFileInput = true;
  }

  onFileSelected(event: any): void {
    this.outputFile = null;
    this.selectedFile = event.target.files[0];
    this.data = {};
    if (
      this.selectedFile.type !== 'image/jpeg' &&
      this.selectedFile.type !== 'image/png'
    ) {
      return;
    }

    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
      img.src = URL.createObjectURL(this.selectedFile);
    }).then((image: HTMLImageElement) => {
      this.cropper.setImage(image);
    });
  }

  save() {
    this.imageUrl = this.data.image;
    this.uploadImage.emit(this.data.image);
    this.selectedFile = null;
    this.data = {};
  }

  cancel() {
    this.selectedFile = null;
    this.outputFile = null;
    this.data = {};
  }
}
