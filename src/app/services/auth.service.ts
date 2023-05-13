import { Injectable } from '@angular/core';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly TOKEN_KEY: string = "AUTH_TOKEN";
  private readonly USER_ID: string = "USER_ID";
  private readonly USER_USERNAME: string = "USER_USERNAME";
  private readonly USER_LOGIN: string = "USER_LOGIN";
  private readonly USER_PICTURE_ID: string = "USER_PICTURE_ID";
  private token: string = "";
  private id: string = "";
  private username: string = "";
  private login: string = "";
  private pictureId: string = "";

  public loadUserData(): void{
    this.id = <string> localStorage.getItem(this.USER_ID);
    this.username = <string> localStorage.getItem(this.USER_USERNAME);
    this.login = <string> localStorage.getItem(this.USER_LOGIN);
    this.pictureId = <string> localStorage.getItem(this.USER_PICTURE_ID);
  }

  public loadToken(): void{
    this.token = <string> localStorage.getItem(this.TOKEN_KEY);
  }

  public setUserUser(firstname: string): void {
    this.username = firstname;
    localStorage.setItem(this.USER_USERNAME, this.username);
  }

  setImageId(imageId: string) {
    this.pictureId = imageId;
    localStorage.setItem(this.USER_PICTURE_ID, this.pictureId);
  }

  public setUser(user: User): void {
    this.id = String(user.userId);
    this.username = user.username;
    this.login = user.login;
    this.pictureId = user.picture;
    this.token = user.token;
    localStorage.setItem(this.TOKEN_KEY, this.token);
    localStorage.setItem(this.USER_ID, this.id);
    localStorage.setItem(this.USER_USERNAME, this.username);
    localStorage.setItem(this.USER_LOGIN, this.login);
    localStorage.setItem(this.USER_PICTURE_ID, this.pictureId);
  }

  public setToken(token: string): void{
    this.token = token;
    localStorage.setItem(this.TOKEN_KEY, this.token);
  }

  public getToken(): string {
    return this.token;
  }

  public getUserId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getUserLogin(): string {
    return this.login;
  }

  public getImageId(): string {
    return this.pictureId;
  }
}
