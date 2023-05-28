import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {appLinks} from "../app.links";
import {Observable} from "rxjs";
import {Collection} from "../models/collections";
import {FindCollectionRequest} from "../models/find-collection-request";
import {FindCollectionItemsRequest} from "../models/find-collection-items-request";
import {CollectionItem} from "../models/collection-item";
import {environment} from "../environments/environment.prod";
import {CollectionItemsComponent} from "../components/collection-items/collection-items.component";
import {FindNotesRequest} from "../models/find-notes-request";
import {Category} from "../models/category";
import {Note} from "../models/note";


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) {
  }

  public getNotes(body: FindNotesRequest): Observable<Category[]> {
    return this.http.post<Category[]>(appLinks.getNotes, body);
  }

  public getCategories(id: number): Observable<Category[]> {
    return this.http.get<Category[]>(appLinks.categories,{
      params: new HttpParams().set('userId', id)
    });
  }

  public createCategory(body: Category): Observable<Category> {
    return this.http.post<Category>(appLinks.categories, body);
  }

  public createNote(body: Note): Observable<Note> {
    return this.http.post<Note>(appLinks.notes, body);
  }

  public deleteNote(id: number): Observable<any> {
    return this.http.delete<any>(appLinks.notes, {
      params: new HttpParams().set('noteId', id)
    });
  }

  public deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(appLinks.categories, {
      params: new HttpParams().set('categoryId', id)
    });
  }

  public updateNote(body: Note): Observable<Note> {
    return this.http.put<Note>(appLinks.notes, body);
  }

  public updateCategory(body: Category): Observable<Category> {
    return this.http.put<Category>(appLinks.categories, body);
  }

  public getNoteById(noteId: number): Observable<Note> {
    return this.http.get<Note>(`${appLinks.notes}/${noteId}`);
  }
}
