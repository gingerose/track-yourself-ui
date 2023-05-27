export interface FindNotesRequest {
  userId: number;
  title: string;
  category: string;
  firstDate: Date;
  secondDate: Date;
}
