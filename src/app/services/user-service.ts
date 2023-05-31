import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class AuthRestService {

  constructor(private http: HttpClient) {
  }

  public login (body: User) : Observable<User>{
    return this.http.post<User>(appLinks.login, body);
  }

  public signUp(body: User) : Observable<User>{
    return this.http.post<User>(appLinks.signup, body);
  }

  public updateUser (body: User) : Observable<User>{
    return this.http.put<User>(appLinks.user, body);
  }
}
