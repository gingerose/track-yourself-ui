import {HabitItem} from "./habit-item";

export interface Habit {
  habitId: number;
  userId: number;
  title: string;
  date: Date;
  habitItems: HabitItem[];
}
