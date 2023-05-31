import {Component} from '@angular/core';
import {FindCollectionItemsRequest} from "../../models/find-collection-items-request";
import {CollectionsComponent} from "../collections/collections.component";
import {CollectionItem} from "../../models/collection-item";
import {Collection} from "../../models/collections";
import {AuthService} from "../../services/auth.service";
import {CollectionService} from "../../services/collection-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-collection-items',
  templateUrl: './collection-items.component.html',
  styleUrls: ['./collection-items.component.css']
})
export class CollectionItemsComponent {
  findCollectionItemsRequest: FindCollectionItemsRequest = {
    description: "",
    status: ""
  }

  collection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "",
    fullAmount: 0,
    doneAmount: 0,
  }

  newTitle: string = ""

  isTitleEdit = false;

  constructor(private authService: AuthService, private collectionService: CollectionService, private route: ActivatedRoute) {
    this.authService.loadUserData()
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      this.collection.collectionId = +params.get('collectionId');
    });
    this.getCollectionItems()
    this.getCollectionById()
  }

  items: CollectionItem[] = [];

  public getCollectionItems(): void {
    this.collectionService.getCollectionItems(this.collection.collectionId, this.findCollectionItemsRequest).subscribe({
      next: (collectionItems: CollectionItem[]): void => {
        this.items = collectionItems
      }
    });
  }

  public getCollectionById(): void {
    this.collectionService.getCollectionById(this.collection.collectionId).subscribe({
      next: (collection: Collection): void => {
        this.collection = collection
      }
    });
  }

  toggleTitleEdit() {
    this.isTitleEdit = true;
    this.newTitle = this.collection.title;
  }

  updateTitle() {
    this.collection.title = this.newTitle;
    this.isTitleEdit = false;
    this.updateCollection(this.collection)
  }

  cancelTitleEdit() {
    this.isTitleEdit = false;
  }

  public updateCollection(collection: Collection): void {
    this.collectionService.updateCollection(collection).subscribe({
      next: (): void => {
      }
    });
  }

  public updateCollectionItem(collectionItem: CollectionItem): void {
    this.collectionService.updateCollectionItem(collectionItem).subscribe({
      next: (): void => {
      }
    });
  }

  public editedItem: CollectionItem = {
    itemId: 0,
    collectionId: 0,
    status: "",
    description: ""
  };

  isEditing(item: CollectionItem): boolean {
    return item === this.editedItem;
  }

  startEditing(item: CollectionItem): void {
    this.editedItem = item;
  }

  stopEditing(item: CollectionItem): void {
    if (this.editedItem.description !== undefined && this.editedItem.description !== '') {
      item.description = this.editedItem.description;
    }
    this.updateCollectionItem(this.editedItem)
    this.editedItem = {
      itemId: 0,
      collectionId: 0,
      status: "",
      description: ""
    };
  }

  toggleStatus(item: CollectionItem): void {
    if (item.status === 'DONE') {
      item.status = 'EMPTY';
    } else {
      item.status = 'DONE';
    }
    this.updateCollectionItem(item);
  }

  submitSearch() {
    this.getCollectionItems()
  }

  addNewItem(): void {
    const newItem: CollectionItem = {
      itemId: -1,
      collectionId: this.collection.collectionId,
      status: 'EMPTY',
      description: "Add your description"
    };
    this.items.push(newItem);
    this.createCollectionItem(newItem)
  }

  public createCollectionItem(collectionItem: CollectionItem): void {
    this.collectionService.createCollectionItem(collectionItem).subscribe({
      next: (): void => {
      }
    });
  }

  public deleteCollectionItem(collectionItem: CollectionItem): void {
    const index = this.items.indexOf(collectionItem);
    this.items.splice(index, 1);
    this.collectionService.deleteCollectionItem(collectionItem).subscribe({
      next: (): void => {
      }
    });
  }
}
