export interface Schedule {
  planId: number;
  userId: number;
  name: string;
  status: string;
  dayOfWeek: number;
  priority: string;
  suggestedTime: string;
  duration: number
}
