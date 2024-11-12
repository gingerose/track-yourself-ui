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
import {BaseCollectionRequest} from "../models/base-collection-request";
import {Recommendation} from "../models/recommendation";
import {SearchBookFilm} from "../models/search-book-film";


@Injectable({
  providedIn: 'root'
})
export class BaseCollectionService {

  constructor(private http: HttpClient) {
  }

  public getBaseCollectionItems(body: BaseCollectionRequest): Observable<CollectionItem[]> {
    return this.http.post<CollectionItem[]>(appLinks.baseCollectionItems, body);
  }

  public updateBaseCollectionItem(body: CollectionItem): Observable<CollectionItem> {
    const url = `${appLinks.updateBaseCollectionItems}`
    return this.http.put<CollectionItem>(url, body);
  }

  public createBaseCollectionItem(body: CollectionItem): Observable<CollectionItem> {
    const url = `${appLinks.addBaseCollectionItems}`
    return this.http.post<CollectionItem>(url, body);
  }

  public deleteBaseCollectionItem(body: CollectionItem): Observable<any> {
    const url = `${appLinks.deleteBaseCollectionItems}/${body.itemId}`
    return this.http.delete(url);
  }

  public getRecommendations(body: BaseCollectionRequest): Observable<Recommendation[]> {
    const url = `${appLinks.getRecommendations}`
    return this.http.post<Recommendation[]>(url, body);
  }

  public generateRecommendations(body: BaseCollectionRequest): Observable<Recommendation[]> {
    const url = `${appLinks.generateRecommendations}`
    return this.http.post<Recommendation[]>(url, body);
  }

  public getBooksData(limit: number, offset: number, search: string): Observable<SearchBookFilm[]> {
    const url = `${appLinks.getBookData}`;
    const body = { limit, offset, search }; // Формируем тело запроса с параметрами
    return this.http.post<SearchBookFilm[]>(url, body);
  }

  public getFilmsData(limit: number, offset: number, search: string): Observable<SearchBookFilm[]> {
    const url = `${appLinks.getFilmData}`;
    const body = { limit, offset, search }; // Формируем тело запроса с параметрами
    return this.http.post<SearchBookFilm[]>(url, body);
  }

}
