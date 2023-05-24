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


@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient) {
  }

  public getCollections(body: FindCollectionRequest): Observable<Collection[]> {
    return this.http.post<Collection[]>(appLinks.getCollections, body);
  }

  public getCollectionById(collectionID: number): Observable<Collection> {
    return this.http.get<Collection>(`${appLinks.collections}/${collectionID}`);
  }

  public createCollection(body: Collection): Observable<Collection> {
    return this.http.post<Collection>(appLinks.collections, body);
  }

  public updateCollection(body: Collection): Observable<Collection> {
    return this.http.put<Collection>(appLinks.collections, body);
  }

  public getCollectionItems(collectionID: number, body: FindCollectionItemsRequest): Observable<CollectionItem[]> {
    const url = `${appLinks.collectionItems}${collectionID}/items/search`;
    return this.http.post<CollectionItem[]>(url, body);
  }

  public updateCollectionItem(body: CollectionItem): Observable<CollectionItem> {
    const url = `${appLinks.collectionItems}${body.collectionId}/items`
    return this.http.put<CollectionItem>(url, body);
  }

  public createCollectionItem(body: CollectionItem): Observable<CollectionItem> {
    const url = `${appLinks.collectionItems}${body.collectionId}/items`
    return this.http.post<CollectionItem>(url, body);
  }

  public deleteCollectionItem(body: CollectionItem): Observable<any> {
    const url = `${appLinks.collectionItems}${body.collectionId}/items`
    return this.http.delete(url,
      {
        params: new HttpParams().set('collectionItemId', body.itemId)
      });
  }

  public deleteCollection(body: Collection): Observable<any> {
    return this.http.delete(appLinks.collections,
      {
        params: new HttpParams().set('collectionId', body.collectionId)
      });
  }
}
