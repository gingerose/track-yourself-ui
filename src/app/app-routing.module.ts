import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestComponent} from "./components/test/test.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {HomeGuard} from "./services/home.guard";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
  { path: 'test', component: TestComponent,  canActivate: [HomeGuard]},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent},
  { path: '', pathMatch: 'full', redirectTo: '/sign-up' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[HomeGuard]
})
export class AppRoutingModule { }
