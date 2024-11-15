import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {AddTeamRequest} from "../models/add-team-request";
import {Team} from "../models/team";
import {TeamTask} from "../models/team-task";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) {
  }

  public addTeam(body: AddTeamRequest): Observable<any> {
    return this.http.post(appLinks.team, body);
  }

  public getTeamsByUserId(id: number): Observable<Team[]> {
    return this.http.get<Team[]>(appLinks.team + '/' + id + '/members');
  }

  public deleteTeam(id: number): Observable<any> {
    return this.http.delete(appLinks.team + '/' + id);
  }

  public updateTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(appLinks.team + '/' + team.teamId, team);
  }

  public getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(appLinks.team + '/' + id);
  }

  public addTeamTask(body: TeamTask): Observable<TeamTask> {
    return this.http.post<TeamTask>(appLinks.task, body);
  }

  public getTeamTasks(teamId: number): Observable<TeamTask[]> {
    return this.http.get<TeamTask[]>(appLinks.team + '/tasks/' + teamId);
  }

  public updateTeamTask(body: TeamTask): Observable<TeamTask> {
    return this.http.put<TeamTask>(appLinks.task + '/' + body.taskId, body);
  }

  public deleteTeamTask(body: TeamTask): Observable<any> {
    return this.http.delete(appLinks.task + '/' + body.taskId);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(appLinks.users);
  }
}
