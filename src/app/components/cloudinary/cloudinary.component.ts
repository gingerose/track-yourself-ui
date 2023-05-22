import {Component, OnInit} from '@angular/core';
import {Cloudinary, CloudinaryImage} from '@cloudinary/url-gen';
import {Transformation} from '@cloudinary/url-gen';

// Import required actions.
import {thumbnail, scale} from '@cloudinary/url-gen/actions/resize';
import {byRadius} from '@cloudinary/url-gen/actions/roundCorners';
import {sepia} from '@cloudinary/url-gen/actions/effect';
import {source} from '@cloudinary/url-gen/actions/overlay';
import {opacity,brightness} from '@cloudinary/url-gen/actions/adjust';
import {byAngle} from '@cloudinary/url-gen/actions/rotate'

// Import required qualifiers.
import {image} from '@cloudinary/url-gen/qualifiers/source';
import {Position} from '@cloudinary/url-gen/qualifiers/position';
import {compass} from '@cloudinary/url-gen/qualifiers/gravity';
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import {Observable} from "rxjs";
import {appLinks} from "../../app.links";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-cloudinary',
  templateUrl: './cloudinary.component.html',
})

export class CloudinaryComponent implements OnInit{
  img!: CloudinaryImage
  cloudName = "dir5cpatv"

  private imageId: string = "";
  private imageWith = 100;
  private imageHeight = 100;

  constructor( private http: HttpClient) {}
  ngOnInit() {

    const cld = new Cloudinary({
      cloud: {
        cloudName: "dir5cpatv",
        apiKey: "899965346192757",
        apiSecret: "RCMQ2gzn5dzRkcLRMp7XCbOvXn0"
      }
    });

    this.img = cld.image('pictures/wbduig2hycbdjritvhm4');

    this.img
      .resize(thumbnail().width(80).height(80).gravity(focusOn(FocusOn.face())))
      .roundCorners(byRadius(100))
      .format('png');
  }
  initImage(): CloudinaryImage {
    return this.initImageWithSize(this.imageId, this.imageWith, this.imageHeight);
  }

  initImageWithSize(imageId: string, width: number, height: number): CloudinaryImage {
    const cld = new Cloudinary({cloud: {cloudName: this.cloudName}});
    return cld.image(imageId)
      .resize(thumbnail().width(width).height(height))
      .roundCorners(byRadius(100));
  }

  public onUpLoad(file: File): Observable<any> {
    const file_data = file;
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', "angular_cloudinary");
    data.append('cloud_name', this.cloudName);
    return this.http.post(appLinks.uploadImage, data);
  }

  onFileSelect($event: any) {
    console.log($event.target.files[0])
    this.onUpLoad($event.target.files[0]).subscribe(
      response => {
        this.imageId = response.public_id;
        this.img = this.initImage();
      });
  }
}
