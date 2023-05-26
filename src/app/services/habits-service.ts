import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {Habit} from "../models/habit";
import {FindHabitsRequest} from "../models/find-habits-request";
import {HabitItem} from "../models/habit-item";


@Injectable({
  providedIn: 'root'
})
export class HabitsService {

  constructor(private http: HttpClient) {
  }

  public getHabits(body: FindHabitsRequest): Observable<Habit[]> {
    return this.http.post<Habit[]>(appLinks.getHabits, body);
  }

  public updateCreateHabitItem(body: HabitItem): Observable<any> {
    const url = `${appLinks.habits}/${body.habitId}/items`
    return this.http.post(url, body);
  }

  public deleteHabitItem(body: HabitItem): Observable<any> {
    const url = `${appLinks.habits}/${body.habitId}/items`
    return this.http.delete(url,
      {
        // @ts-ignore
        params: new HttpParams().set('itemId', body.itemId)
      });
  }

  public createHabit(body: Habit): Observable<Habit> {
    return this.http.post<Habit>(appLinks.habits, body);
  }

  public updateHabit(body: Habit): Observable<Habit> {
    return this.http.put<Habit>(appLinks.habits, body);
  }

  public deleteHabit(id: number): Observable<any> {
    return this.http.delete(appLinks.habits,
      {
        params: new HttpParams().set('habitId', id)
      });
  }
}
