export interface TeamTask {
  memberId: number;
  taskId: number;
  title: string;
  date: Date;
  comment: string;
  status: string;
  username: string;
  picture: string;
  isLead: boolean
}
