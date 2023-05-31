import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {FindPlansRequest} from "../models/find-plans-request";
import {Plan} from "../models/plan";
import {StatisticRequest} from "../models/StatisticRequest";
import {StatisticPlans} from "../models/StatisticPlans";
import {StatisticCollections} from "../models/StatisticCollections";
import {StatisticHabits} from "../models/StatisticHabits";


@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) {
  }

  public statisticPlans(body: StatisticRequest): Observable<StatisticPlans[]> {
    return this.http.post<StatisticPlans[]>(appLinks.statisticPlans, body);
  }

  public statisticCollections(body: StatisticRequest): Observable<StatisticCollections[]> {
    return this.http.post<StatisticCollections[]>(appLinks.statisticCollections, body);
  }

  public statisticHabits(body: StatisticRequest): Observable<StatisticHabits[]> {
    return this.http.post<StatisticHabits[]>(appLinks.statisticHabits, body);
  }
}
