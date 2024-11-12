import {Component} from "@angular/core";
import {Collection} from "../../models/collections";
import {debounceTime, Subject, Subscription, switchMap} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CollectionItem} from "../../models/collection-item";
import {BaseCollectionRequest} from "../../models/base-collection-request";
import {BaseCollectionService} from "../../services/base-collection-service";
import {SearchBookFilm} from "../../models/search-book-film";
import {Recommendation} from "../../models/recommendation";

@Component({
  selector: 'app-plan-item',
  templateUrl: './base-collection-item.component.html',
  styleUrls: ['./base-collection-item.component.css']
})

export class BaseCollectionItemComponent {

  baseCollectionRequest: BaseCollectionRequest = {
    userId: 0,
    collectionId: 0
  }

  collection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "",
    fullAmount: 0,
    doneAmount: 0,
  }

  collectionItem: CollectionItem = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    itemId: 0,
    status: '',
    description: ''
  }

  items: CollectionItem[] = [];
  recommendations: Recommendation[] = [];
  private subscription: Subscription = new Subscription();


  limit: number = 10;
  offset: number = 0;
  isAllLoaded: boolean = false;
  searchTerm: string = '';
  selectedItem: SearchBookFilm | null = null;
  options: { label: string; value: number }[] = [];
  isLoading: boolean = false;
  private searchSubject = new Subject<string>();
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private collectionService: BaseCollectionService, private route: ActivatedRoute) {
    this.authService.loadUserData()
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      this.collection.collectionId = +params.get('collectionId');
    });
    if (this.collection.collectionId == 9875768) {
      this.collection.title = 'Books'
    } else {
      this.collection.title = 'Movies'
    }
    this.baseCollectionRequest.userId = +authService.getUserId()
    console.log(this.baseCollectionRequest.userId )
    console.log( +authService.getUserId() )
    this.baseCollectionRequest.collectionId = this.collection.collectionId
    this.getCollectionItems()
    this.getRecommendations()

    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((term) => this.fetchData(term))
      )
      .subscribe((results) => {
        this.options = results.map(item => ({
          label: item.Name,
          value: item.id,
        }));
        this.isLoading = false;
      });
  }

  public getCollectionItems(): void {
    this.collectionService.getBaseCollectionItems(this.baseCollectionRequest).subscribe({
      next: (collectionItems: CollectionItem[]): void => {
        this.items = collectionItems
      }
    });
  }

  public getRecommendations(): void {
    this.collectionService.getRecommendations(this.baseCollectionRequest).subscribe({
      next: (recommendations: Recommendation[]): void => {
        this.recommendations = recommendations
      }
    });
  }

  public updateCollectionItem(collectionItem: CollectionItem): void {
    this.collectionService.updateBaseCollectionItem(collectionItem).subscribe({
      next: (): void => {
      }
    });
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

  public createCollectionItem(collectionItem: CollectionItem): void {
    this.collectionService.createBaseCollectionItem(collectionItem).subscribe({
      next: (createdItem: CollectionItem): void => {
        this.items.push(createdItem);
      },
      error: (error) => {
        console.error("Ошибка при добавлении элемента:", error);
      }
    });
  }


  public deleteCollectionItem(collectionItem: CollectionItem): void {
    const index = this.items.indexOf(collectionItem);
    this.items.splice(index, 1);
    this.collectionService.deleteBaseCollectionItem(collectionItem).subscribe({
      next: (): void => {
      }
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    if (this.collection.collectionId == 9875768) {
      this.collectionService.getBooksData(this.limit, this.offset, '')
        .subscribe(data => {
          this.options = data.map(item => ({
            label: item.Name,
            value: item.id
          }));
          this.isLoading = false;
        });
    } else {
      this.collectionService.getFilmsData(this.limit, this.offset, '')
        .subscribe(data => {
          this.options = data.map(item => ({
            label: item.Name,
            value: item.id
          }));
          this.isLoading = false;
        });
    }
  }

  // Функция поиска по вводимому тексту
  onSearch(value: string): void {
    if (value === '') {
      this.loadInitialData();
    } else {
      this.isLoading = true;
      this.searchSubject.next(value);
    }
  }

  // Запрос данных из сервиса
  private fetchData(search: string, reset: boolean = false) {
    if (this.collection.collectionId == 9875768) {
      return this.collectionService.getBooksData(this.limit, this.offset, search);
    } else {
      return this.collectionService.getFilmsData(this.limit, this.offset, search);
    }
  }

  onSelect(itemId: number): void {
    const selectedOption = this.options.find(option => option.value === itemId);
    if (selectedOption) {
      this.selectedItem = { id: itemId, Name: selectedOption.label };
      console.log("Selected item:", this.selectedItem);
      this.collectionItem.collectionId = this.collection.collectionId
      this.collectionItem.status = 'EMPTY'
      this.collectionItem.itemId = this.selectedItem.id
      this.collectionItem.description = this.selectedItem.Name
      this.createCollectionItem(this.collectionItem)
    }
  }

  loadMore(): void {
    if (this.isAllLoaded || this.isLoading) return;

    this.isLoading = true;
    this.offset += this.limit;
    this.fetchData(this.searchTerm).subscribe(data => {
      console.log(data.length)
      // if (data.length < this.limit) {
      //   this.isAllLoaded = true; // Если данных меньше лимита, значит мы загрузили всё
      // }
      const newOptions = data.map(item => ({
        label: item.Name,
        value: item.id
      }));
      this.options = [...this.options, ...newOptions];
      this.isLoading = false;
    });
  }

}
