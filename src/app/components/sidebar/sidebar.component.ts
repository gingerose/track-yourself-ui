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
import {cld} from "../../app.links";

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
  constructor(private authService: AuthService, public router: Router) {
    this.authService.loadUserData();

    this.links = [
      {name: "PLANNING", link: "/user/plans", icon: "schedule"},
      {name: "COLLECTIONS", link: "/user/collections", icon: "group"},
      {name: "HABITS", link: "/user/habits", icon: "insert-row-above"},
      {name: "NOTES", link: "/user/notes", icon: "read"},
      {name: "STATISTICS", link: "/user/statistics", icon: "bar-chart"},
    ];

    this.user = authService.getUser();

    if (this.user.picture === "null" || this.user.picture === "") {
      this.user.picture = this.imgId
    }
  }

  ngOnInit() {
    this.img = cld.image('pictures/' + this.user.picture);

    this.img
      .resize(thumbnail().width(80).height(80).gravity(focusOn(FocusOn.face())))
      .roundCorners(byRadius(100))
      .format('png');
  }
}
