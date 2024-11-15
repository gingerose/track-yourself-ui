import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlansComponent} from "./components/plans/plans.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {HomeGuard} from "./services/home.guard";
import {LoginComponent} from "./components/login/login.component";
import {CloudinaryComponent} from "./components/cloudinary/cloudinary.component";
import {MainComponent} from "./components/main/main.component";
import {CollectionsComponent} from "./components/collections/collections.component";
import {CollectionItemsComponent} from "./components/collection-items/collection-items.component";
import {HabitsComponent} from "./components/habits/habits.component";
import {NotesComponent} from "./components/notes/notes.component";
import {NoteItemComponent} from "./components/note-item/note-item.component";
import {StatisticComponent} from "./components/statistic/statistic.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {PlansItemComponent} from "./components/plan-item/plan-item.component";
import {BaseCollectionItemComponent} from "./components/base-collection-item/base-collection-item.component";
import {TeamsComponent} from "./components/teams/teams.component";

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent},
  { path: 'image', component: CloudinaryComponent},
  { path: 'user', component: MainComponent,
    canActivate: [HomeGuard],
    children: [
      { path: 'plans', component: PlansComponent },
      { path: 'plans/:planId/item', component: PlansItemComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'collections', component: CollectionsComponent },
      { path: 'collections/:collectionId/item', component: CollectionItemsComponent },
      { path: 'collections/base/:collectionId/item', component: BaseCollectionItemComponent },
      { path: 'habits', component: HabitsComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'notes/:noteId', component: NoteItemComponent },
      { path: 'statistic', component: StatisticComponent },
      { path: 'teams', component: TeamsComponent },
    ]},
  { path: '', pathMatch: 'full', redirectTo: '/sign-up' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[HomeGuard]
})
export class AppRoutingModule { }
