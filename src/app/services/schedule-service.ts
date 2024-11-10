import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {FindPlansRequest} from "../models/find-plans-request";
import {Plan} from "../models/plan";
import {Schedule} from "../models/schedule";
import {FindScheduleRequest} from "../models/find-schedule-request";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {
  }

  public getSchedule(body: FindScheduleRequest): Observable<Schedule[]> {
    return this.http.post<Schedule[]>(appLinks.getSchedule, body);
  }

  public generateSchedule(body: FindScheduleRequest): Observable<Schedule[]> {
    return this.http.post<Schedule[]>(appLinks.generateSchedule, body);
  }

}
