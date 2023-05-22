import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlansComponent} from "./components/plans/plans.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {HomeGuard} from "./services/home.guard";
import {LoginComponent} from "./components/login/login.component";
import {CloudinaryComponent} from "./components/cloudinary/cloudinary.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MainComponent} from "./components/main/main.component";

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent},
  { path: 'image', component: CloudinaryComponent},
  { path: 'user', component: MainComponent,
    children: [
      { path: 'plans', component: PlansComponent },
    ]},
  { path: '', pathMatch: 'full', redirectTo: '/sign-up' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[HomeGuard]
})
export class AppRoutingModule { }
