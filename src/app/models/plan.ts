export interface Plan {
  planId: number;
  userId: number;
  name: string;
  description: string;
  status: string;
  creationDate: Date;
  dayOfWeek: number;
  priority: string;
  duration: number;
  deadline: Date;
  decomposition: string;
}
