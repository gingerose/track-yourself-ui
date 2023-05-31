import {Component} from '@angular/core';
import {Habit} from "../../models/habit";
import {HabitItem} from "../../models/habit-item";
import {FindHabitsRequest} from "../../models/find-habits-request";
import {Plan} from "../../models/plan";
import {AuthService} from "../../services/auth.service";
import {HabitsService} from "../../services/habits-service";
import {CollectionItem} from "../../models/collection-item";
import {Collection} from "../../models/collections";

interface Day {
  day: number | null;
  status: string | null;
}

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent {
  habits: Habit[] = [];

  selectedDate: Date = new Date();

  findHabitsRequest: FindHabitsRequest = {
    userId: +this.authService.getUserId(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    title: ""
  };

  selectedYear: number;
  selectedMonth: number;

  selectedMonthName: string;
  daysOfWeek: string[];
  calendar: Day[][] | undefined;
  private habitDelete: Habit = {
    habitId: -1,
    userId: +this.authService.getUserId(),
    title: "",
    date: this.selectedDate,
    habitItems: []
  };

  constructor(private authService: AuthService, private habitsService: HabitsService) {
    this.authService.loadUserData()
    this.getHabits();
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedMonthName = this.getMonthName(this.selectedMonth);
    this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const lastDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Коррекция начала недели на понедельник
    const lastDayOfWeek = (lastDayOfMonth.getDay() + 6) % 7; // Коррекция начала недели на понедельник

    this.calendar = [];
    let week: Day[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push({day: null, status: null});
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const habitItemsForDay = this.getHabitItemsForDay(i);
      week.push({day: i, status: habitItemsForDay.length > 0 ? habitItemsForDay[0].status : null});

      if (week.length === 7) {
        this.calendar.push(week);
        week = [];
      }
    }

    for (let i = lastDayOfWeek + 1; i <= 6; i++) {
      week.push({day: null, status: null});
    }

    this.calendar.push(week);
  }

  getHabitItemsForDay(day: number): HabitItem[] {
    const habitItems: HabitItem[] = [];

    for (const habit of this.habits) {
      const habitItem = habit.habitItems.find(
        item =>
          item.date.getDate() === day &&
          item.date.getMonth() === this.selectedMonth - 1 &&
          item.date.getFullYear() === this.selectedYear
      );
      if (habitItem) {
        habitItems.push(habitItem);
      }
    }

    return habitItems;
  }

  getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  }

  toggleStatus(habit: Habit, day: Day): void {
    if (day.day !== null) {
      const habitItemIndex = habit.habitItems.findIndex(item => item.date.getDate() === day.day);
      if (habitItemIndex !== -1) {
        this.deleteHabitItem(habit.habitItems[habitItemIndex])
        habit.habitItems.splice(habitItemIndex, 1);
      } else {
        const newHabitItem: HabitItem = {
          itemId: null,
          habitId: habit.habitId,
          date: new Date(this.selectedYear, this.selectedMonth - 1, day.day),
          status: 'DONE'
        };
        this.createUpdateHabitItem(newHabitItem)
        habit.habitItems.push(newHabitItem);
      }
    }
  }

  isHabitDone(habit: Habit, day: Day): boolean {
    if (day.day !== null) {
      return habit.habitItems.some(item => item.date.getDate() === day.day && item.date.getMonth() + 1 === this.selectedMonth && item.date.getFullYear() === this.selectedYear && item.status === 'DONE');
    }
    return false;
  }
  editedHabit: Habit = {
    habitId: -1,
    userId: +this.authService.getUserId(),
    title: "",
    date: new Date(),
    habitItems: []
  };
  showDeletePopup: boolean = false;

  onDateChange(date: Date): void {
    if (date) {
      this.selectedDate = date;
      this.selectedYear = this.selectedDate.getFullYear();
      this.selectedMonth = this.selectedDate.getMonth() + 1;
      this.selectedMonthName = this.getMonthName(this.selectedMonth);
      this.findHabitsRequest.year = this.selectedYear;
      this.findHabitsRequest.month = this.selectedMonth;
      this.getHabits();
      this.generateCalendar();
    }
  }

  public getHabits(): void {
    this.habitsService.getHabits(this.findHabitsRequest).subscribe({
      next: (habits: Habit[]): void => {
        this.habits = habits
        this.habits.forEach(habit => {
          habit.habitItems.forEach(item => {
            item.date = new Date(item.date);
          });
        });
      }
    });
  }

  public createUpdateHabitItem(item: HabitItem): void {
    this.habitsService.updateCreateHabitItem(item).subscribe({
      next: (): void => {
      }
    });
  }

  public deleteHabitItem(item: HabitItem): void {
    this.habitsService.deleteHabitItem(item).subscribe({
      next: (): void => {
      }
    });
  }

  submitSearch() {
    this.getHabits()
  }

  public createHabit(habit: Habit): void {
    this.habitsService.createHabit(habit).subscribe({
      next: (habit: Habit): void => {
        habit.habitItems = []
        this.habits.push(habit)
      }
    });
  }

  addHabit() {
    const habit: Habit = {
      habitId: -1,
      userId: +this.authService.getUserId(),
      title: "New habit",
      date: this.selectedDate,
      habitItems: []
    }
    this.createHabit(habit)
  }

  public updateHabit(habit: Habit): void {
    this.habitsService.updateHabit(habit).subscribe({
      next: (): void => {
      }
    });
  }

  isEditing(habit: Habit) {
    return habit === this.editedHabit;
  }

  startEditing(habit: Habit) {
    this.editedHabit = habit;
  }

  stopEditing(habit: Habit) {
    habit.title = this.editedHabit.title
    this.editedHabit.userId = +this.authService.getUserId()
    this.updateHabit(this.editedHabit)
    this.editedHabit = {
      habitId: -1,
      userId: +this.authService.getUserId(),
      title: "",
      date: new Date(),
      habitItems: []
    };
  }

  confirmDelete(habit: Habit) {
    this.habitDelete = habit
    this.showDeletePopup = true;
  }

  deleteHabit() {
    const index = this.habits.indexOf(this.habitDelete);
    if (index !== -1) {
      this.habits.splice(index, 1);
      this.deleteHabitApi(this.habitDelete)
    }
    this.showDeletePopup = false;
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  private deleteHabitApi(habit: Habit) {
    this.habitsService.deleteHabit(habit.habitId).subscribe({
      next: (): void => {
      }
    });
  }
}
