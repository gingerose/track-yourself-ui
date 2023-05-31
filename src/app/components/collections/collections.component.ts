import {Component} from '@angular/core';
import {Collection} from "../../models/collections";
import {Plan} from "../../models/plan";
import {FindCollectionRequest} from "../../models/find-collection-request";
import {AuthService} from "../../services/auth.service";
import {PlanService} from "../../services/plan-service";
import {CollectionService} from "../../services/collection-service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent {
  collections: Collection[] = [];
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
}
