import {Component} from '@angular/core';
import {Note} from "../../models/note";
import {AuthService} from "../../services/auth.service";
import {NotesService} from "../../services/notes-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../../models/category";

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.css']
})
export class NoteItemComponent {
  note: Note = {
    noteId: -1,
    userId: +this.authService.getUserId(),
    title: '',
    date: new Date(),
    text: '',
    categoryId: -1
  }

  isEditing: boolean = false;
  editedText: string = '';

  ngOnInit(): void {
    this.editedText = this.note.text;
  }
  constructor(private authService: AuthService, private noteService: NotesService, private route: ActivatedRoute) {
    authService.loadUserData()
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      this.note.noteId = +params.get('noteId');
    });
    this.getNote()
  }

  submitEdit() {
    clearTimeout(this.submitTimeout);
    this.submitTimeout = setTimeout(() => {
      this.submitEdit();
      this.updateNote()
    }, 1000);
  }

  private submitTimeout: any;
  isTitleEdit: boolean = false;

  private getNote() {
    this.noteService.getNoteById(this.note.noteId).subscribe({
      next: (note: Note): void => {
        this.note = note
      }
    });
  }

  public updateNote() {
    this.noteService.updateNote(this.note).subscribe({
      next: (): void => {
      }
    });
    this.isTitleEdit = false
  }

  toggleTitleEdit() {
    this.isTitleEdit = true
  }
}
