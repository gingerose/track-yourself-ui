import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {PlansComponent} from "./components/plans/plans.component";
import {LoginComponent} from "./components/login/login.component";
import {CloudinaryComponent} from "./components/cloudinary/cloudinary.component";
import {CloudinaryModule} from "@cloudinary/ng";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MainComponent} from "./components/main/main.component";
import {AuthInterceptor} from "./services/interceptors/http-interceptors/auth-interceptor";
import {CollectionsComponent} from "./components/collections/collections.component";
import {CollectionItemsComponent} from "./components/collection-items/collection-items.component";
import {HabitsComponent} from "./components/habits/habits.component";
import {NzCalendarModule} from "ng-zorro-antd/calendar";
import { MatIconModule } from '@angular/material/icon';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NotesComponent} from "./components/notes/notes.component";
import {NoteItemComponent} from "./components/note-item/note-item.component";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    PlansComponent,
    LoginComponent,
    CloudinaryComponent,
    SidebarComponent,
    MainComponent,
    CollectionsComponent,
    CollectionItemsComponent,
    HabitsComponent,
    NotesComponent,
    NoteItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzAlertModule,
    CloudinaryModule,
    NzCalendarModule,
    MatIconModule,
    NzDatePickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
