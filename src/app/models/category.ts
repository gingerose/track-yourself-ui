import {Note} from "./note";

export interface Category {
  userId: number;
  categoryId: number;
  title: string;
  notes: Note[];
}
