import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {FindPlansRequest} from "../models/find-plans-request";
import {Plan} from "../models/plan";


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) {
  }

  public getPlans(body: FindPlansRequest): Observable<Plan[]> {
    return this.http.post<Plan[]>(appLinks.getPlans, body);
  }

  public updatePlan(body: Plan): Observable<any> {
    return this.http.put(appLinks.plans, body);
  }

  public addPlan(body: Plan): Observable<any> {
    return this.http.post(appLinks.plans, body);
  }

  public deletePlan(id: number): Observable<any> {
    return this.http.delete(appLinks.plans,
      {
        params: new HttpParams().set('planId', id)
      });
  }

}
