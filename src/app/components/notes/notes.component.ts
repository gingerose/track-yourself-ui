import {Component} from '@angular/core';
import {Category} from "../../models/category";
import {Collection} from "../../models/collections";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NotesService} from "../../services/notes-service";
import {FindNotesRequest} from "../../models/find-notes-request";
import {Note} from "../../models/note";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {

  categories: Category[] = []
  categoryNotes: Category[] = [];
  findNotesRequest: FindNotesRequest = {
    userId: +this.authService.getUserId(),
    title: "",
    category: "",
    // @ts-ignore
    firstDate: null,
    // @ts-ignore
    secondDate: null
  }
  showPopup: boolean = false;
  newNote: Note = {
    noteId: -1,
    userId: +this.authService.getUserId(),
    title: "",
    date: new Date(),
    text: "",
    categoryId: -1,
  }

  newCategory: Category = {
    userId: +this.authService.getUserId(),
    categoryId: -1,
    title: "",
    notes: []
  }
  selectedCategoryId: number = -1
  showDeletePopup: boolean = false;
  categoryToDelete: Category = {
    userId: +this.authService.getUserId(),
    categoryId: -1,
    title: "",
    notes: []
  };
  isCategoryEdit: boolean = false;
  newCategoryTitle: string = "";

  constructor(private authService: AuthService, private noteService: NotesService, private router: Router) {
    authService.loadUserData()
    this.getNotes()
    this.getCategories()
  }

  public getNotes(): void {
    this.noteService.getNotes(this.findNotesRequest).subscribe({
      next: (categoryNotes: Category[]): void => {
        this.categoryNotes = categoryNotes
      }
    });
  }

  public getCategories(): void {
    this.noteService.getCategories(+this.authService.getUserId()).subscribe({
      next: (categories: Category[]): void => {
        this.categories = categories
      }
    });
  }

  submitSearch() {
    this.getNotes()
  }

  openPopup() {
    this.showPopup = true;
  }

  cancel() {
    this.showPopup = false;
  }

  addNote() {
    this.addNoteApi()
    this.showPopup = false;
    this.newNote = {
      noteId: -1,
      userId: +this.authService.getUserId(),
      title: "",
      date: new Date(),
      text: "",
      categoryId: -1,
    }
  }

  addCategory() {
    this.noteService.createCategory(this.newCategory).subscribe({
      next: (category: Category): void => {
        this.categories.push(category)
        //this.categoryNotes.push(category)
        this.newCategory = {
          userId: +this.authService.getUserId(),
          categoryId: -1,
          title: "",
          notes: []
        }
      }
    });
  }

  addNoteApi() {
    this.newNote.categoryId = this.selectedCategoryId
    this.noteService.createNote(this.newNote).subscribe({
      next: (note: Note): void => {
        this.getNotes()
      }
    });
  }

  confirmDeleteNote(note: Note): void {
    const categoryIndex = this.categoryNotes.findIndex(category => category.categoryId === note.categoryId);

    if (categoryIndex !== -1) {
      const noteIndex = this.categoryNotes[categoryIndex].notes.findIndex(n => n.noteId === note.noteId);

      if (noteIndex !== -1) {
        this.categoryNotes[categoryIndex].notes.splice(noteIndex, 1);
      }

      if (this.categoryNotes[categoryIndex].notes.length === 0) {
        this.categoryNotes.splice(categoryIndex, 1);
      }
    }

    this.noteService.deleteNote(note.noteId).subscribe({
      next: (): void => {
      }
    });
  }

  public confirmDeleteCategory(category: Category) {
    this.categoryToDelete = category;
    this.showDeletePopup = true;
  }

  public deleteCategory() {
    const index = this.categoryNotes.indexOf(this.categoryToDelete);
    const index2 = this.categories.indexOf(this.categoryToDelete);
    if (index !== -1) {
      this.categoryNotes.splice(index, 1);
      this.categories.splice(index2, 1);
      this.noteService.deleteCategory(this.categoryToDelete.categoryId).subscribe({
        next: (): void => {
        }
      });
    }
    this.showDeletePopup = false;
  }

  public cancelDelete() {
    this.showDeletePopup = false;
  }

  updateCategory(category: Category) {
    category.title = this.newCategoryTitle
    category.userId = +this.authService.getUserId()
    this.isCategoryEdit = false;
    this.noteService.updateCategory(category).subscribe({
      next: (): void => {
        this.getCategories()
      }
    });
  }

  cancelCategoryEdit() {
    this.isCategoryEdit = false
  }

  toggleCategoryEdit(category: Category) {
    this.isCategoryEdit = true;
    this.newCategoryTitle = category.title;
  }

  goToNote(note: Note) {
    this.router.navigate([`/user/notes/${note.noteId}`]);
  }
}
