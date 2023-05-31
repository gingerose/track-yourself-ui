import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MapElement} from "./MapElement";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {appLinks, cld} from "../../app.links";
import {Observable, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthRestService} from "../../services/user-service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  imgId = "1487716857-user_81635_yn9dxl"
  img!: CloudinaryImage
  links: MapElement[] = [];
  user: User
  showPopup: boolean = false;
  checkPassword: string = "";
  cloudName = "dir5cpatv"
  private imageId: string = "";
  private imageWith = 80;
  private imageHeight = 80;
  error: boolean = false;
  message: string = "";
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, public router: Router, private http: HttpClient, private userService: AuthRestService) {
    this.authService.loadUserData();

    this.links = [
      {name: "PLANNING", link: "/user/plans", icon: "schedule"},
      {name: "COLLECTIONS", link: "/user/collections", icon: "group"},
      {name: "HABITS", link: "/user/habits", icon: "insert-row-above"},
      {name: "NOTES", link: "/user/notes", icon: "read"},
      {name: "STATISTICS", link: "/user/statistic", icon: "bar-chart"},
    ];

    this.user = authService.getUser();

    if (this.user.picture === "null" || this.user.picture === "") {
      this.user.picture = this.imgId
    }

    console.log(this.user.picture)

    this.img = cld.image(this.user.picture);

    this.img
      .resize(thumbnail().width(80).height(80).gravity(focusOn(FocusOn.face())))
      .roundCorners(byRadius(100))
      .format('png');
  }

  updateUser() {
    console.log(this.user.picture)
    if (this.user.password == this.checkPassword) {
      this.userService.updateUser(this.user).subscribe({
        next: (): void => {
          this.authService.setUser(this.user)
        }
      });
      this.showPopup = false;
    } else {
      this.error = true
      this.message = 'Check your password'
    }
  }

  cancel() {
    this.showPopup = false;
  }

  openPopup() {
    this.showPopup = true;
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
        console.log(this.imageId)
        this.user.picture = this.imageId
      });
  }

  initImage(): CloudinaryImage {
    return this.initImageWithSize(this.imageId, this.imageWith, this.imageHeight);
  }

  initImageWithSize(imageId: string, width: number, height: number): CloudinaryImage {
    const cld = new Cloudinary({cloud: {cloudName: this.cloudName}});
    return cld.image(imageId)
      .resize(thumbnail().width(width).height(height))
      .backgroundColor("#E4F6CB")
      .roundCorners(byRadius(100));
  }
}
