import {Component} from '@angular/core';
import {Collection} from "../../models/collections";
import {FindCollectionRequest} from "../../models/find-collection-request";
import {AuthService} from "../../services/auth.service";
import {CollectionService} from "../../services/collection-service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {BaseCollectionRequest} from "../../models/base-collection-request";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent {
  collections: Collection[] = [];
  baseCollections: Collection[] = [];
  findCollectionsRequest: FindCollectionRequest = {
    userId: -1,
    title: "",
    // @ts-ignore
    firstDate: null,
    // @ts-ignore
    secondDate: null
  }

  newCollection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "New Collection",
    fullAmount: 0,
    doneAmount: 0,
  }

  filmCollection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: 2435466,
    title: "Movies",
    fullAmount: 0,
    doneAmount: 0,
  }

  baseCollectionRequest: BaseCollectionRequest = {
    userId: 0,
    collectionId: ""
  }

  bookCollection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: 9875768,
    title: "Books",
    fullAmount: 0,
    doneAmount: 0,
  }

  showDeletePopup?: boolean;
  collectionToDelete: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "",
    fullAmount: 0,
    doneAmount: 0
  };
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private collectionService: CollectionService, private router: Router) {
    authService.loadUserData()
    this.findCollectionsRequest.userId = +authService.getUserId()
    this.getCollections()
    this.baseCollectionRequest.userId = +authService.getUserId()
    this.baseCollectionRequest.collectionId = String(this.bookCollection.collectionId)
    this.getCountBookCollectionApi()
    this.baseCollectionRequest.collectionId = String(this.filmCollection.collectionId)
    this.getCountFilmCollectionApi()
    this.baseCollections.push(this.bookCollection);
    this.baseCollections.push(this.filmCollection);
    console.log(this.baseCollections);

  }

  public getCollections(): void {
    this.collectionService.getCollections(this.findCollectionsRequest).subscribe({
      next: (collections: Collection[]): void => {
        this.collections = collections
      }
    });
  }

  submitSearch(): void {
    this.getCollections()
  }

  addCollection(): void {
    this.addCollectionApi(this.newCollection)
  }

  public addCollectionApi(collection: Collection): void {
    this.collectionService.createCollection(collection).subscribe({
      next: (collect: Collection): void => {
        const collectionId = collect.collectionId;
        this.router.navigate([`/user/collections/${collectionId}/item`]);
      }
    });
  }

  toCollection(item: Collection) {
    this.router.navigate([`/user/collections/${item.collectionId}/item`]);
  }

  toBaseCollection(item: Collection) {
    this.router.navigate([`/user/collections/${item.collectionId}/item`]);
  }

  deleteCollectionApi(item: Collection) {
    this.collectionService.deleteCollection(item).subscribe({
      next: (): void => {
      }
    });
  }

  confirmDelete(collection: Collection) {
    this.collectionToDelete = collection;
    this.showDeletePopup = true;
  }

  deleteCollection() {
    const index = this.collections.indexOf(this.collectionToDelete);
    if (index !== -1) {
      this.collections.splice(index, 1);
      this.deleteCollectionApi(this.collectionToDelete)
    }
    this.showDeletePopup = false;
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  getCountBookCollectionApi() {
    this.collectionService.baseCollectionCount(this.baseCollectionRequest).subscribe({
      next: (response: number[]): void => {
        this.bookCollection.doneAmount = response[0];
        this.bookCollection.fullAmount = response[1];
      }
    });
  }

  getCountFilmCollectionApi() {
    this.collectionService.baseCollectionCount(this.baseCollectionRequest).subscribe({
      next: (response: number[]): void => {
        this.filmCollection.doneAmount = response[0];
        this.filmCollection.fullAmount = response[1];
      }
    });
  }
}
