import {Component} from '@angular/core';
import {Plan} from '../../models/plan';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {PlanService} from "../../services/plan-service";
import {FindPlansRequest} from "../../models/find-plans-request";
import {Subscription} from "rxjs";
import {ScheduleService} from "../../services/schedule-service";
import {Schedule} from "../../models/schedule";
import {FindScheduleRequest} from "../../models/find-schedule-request";
import {DatePipe, formatDate} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Su', 'Sn'];

  showPicker = false;
  pickerTop = 0;
  pickerLeft = 0;
  selectedPlan: Plan | null = null;
  selectedScheduleItem: Schedule | null = null;
  selectedDayOfWeek: number | null = null;
  user: User
  plans: Plan[] = []
  schedule: Schedule[] = []
  findPlansRequest: FindPlansRequest = {
    userId: 0,
    description: "",
    status: "",
    date: new Date()
  }

  public loading: boolean = false;

  findScheduleRequest: FindScheduleRequest = {
    userId: 0,
    date: this.datePipe.transform(new Date(), 'dd.MM.yyyy') || ''
  }

  showPopup: boolean = false;
  newPlan: Plan = {
    planId: 0,
    userId: 0,
    name: "",
    description: "",
    status: "EMPTY",
    creationDate: new Date(),
    dayOfWeek: -1,
    priority: "LOW",
    duration: 0,
    deadline: new Date(),
    decomposition: ""
  };

  showDeletePopup: boolean = false;
  planToDelete: any;
  weekDates: Date[] = [];
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private planService: PlanService,
              private scheduleService: ScheduleService, private datePipe: DatePipe,
              private router: Router) {
    this.authService.loadUserData()
    this.user = authService.getUser();
    this.findPlansRequest.userId = this.user.userId
    this.findScheduleRequest.userId = this.user.userId
    this.getDates(this.findPlansRequest.date)
    for (const date of this.weekDates) {
      console.log(date.toDateString());
    }
    this.getSchedule()
    this.getPlans();
  }

  getStatusColor(scheduleItem: Schedule, currentDayOfWeek: number): string {
    if (scheduleItem.dayOfWeek == currentDayOfWeek) {
      switch (scheduleItem.status) {
        case 'DONE':
          return 'green';
        case 'IN_PROGRESS':
          return 'yellow';
        case 'NOT_ACTUAL':
          return 'red';
        case 'DELAY':
          return 'blue';
        case 'EMPTY':
          return 'empty';
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  getBackgroundClass(suggestedTime: string): string {
    switch (suggestedTime) {
      case 'morning':
        return 'morning-background';
      case 'afternoon':
        return 'day-background';
      case 'evening':
        return 'night-background';
      default:
        return '';
    }
  }


  public getPlans(): void {
    this.planService.getPlans(this.findPlansRequest).subscribe({
      next: (plans: Plan[]): void => {
        this.plans = plans
        this.getDates(this.findPlansRequest.date);
      }
    });
  }

  public getPlanById(id: number): void {
    this.planService.getPlanById(id).subscribe({
      next: (plan: Plan): void => {
        this.selectedPlan = plan
      }
    });
  }

  public getSchedule(): void {
    this.scheduleService.getSchedule(this.findScheduleRequest).subscribe({
      next: (schedule: Schedule[]): void => {
        this.schedule = schedule
        const [day, month, year] = this.findScheduleRequest.date.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        this.getDates(date);
      }
    });
    console.log(this.schedule)
  }

  public generateSchedule(): void {
    this.loading = true;
    this.scheduleService.generateSchedule(this.findScheduleRequest).subscribe({
      next: (schedule: Schedule[]): void => {
        this.schedule = schedule;

        const [day, month, year] = this.findScheduleRequest.date.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        this.getDates(date);

        this.loading = false;
      },
      error: (error) => {
        console.error("Error generating schedule", error);
        this.loading = false;
      }
    });
  }


  public addPlanApi(plan: Plan): void {
    this.planService.addPlan(plan).subscribe({
      next: (): void => {
        this.getPlans()
      }
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  onDateChange(value: string) {
    this.newPlan.creationDate = new Date(value);
  }

  cancel() {
    this.showPopup = false;
  }

  dateToString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  getDates(date: Date): void {
    this.weekDates = []
    const currentDate = new Date(date)

    let currentDayOfWeek = currentDate.getDay();
    if (currentDayOfWeek === 0) {
      currentDayOfWeek = 6;
    } else {
      currentDayOfWeek -= 1;
    }

    const mondayDiff = currentDayOfWeek;

    const mondayDate = new Date(currentDate);
    mondayDate.setDate(currentDate.getDate() - mondayDiff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + i);
      this.weekDates.push(date);
    }
  }

  submitSearch(): void {
    this.findScheduleRequest.date = formatDate(this.findScheduleRequest.date, 'dd.MM.yyyy', 'en');
    this.getSchedule()
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'priority-low';
      case 'MEDIUM':
        return 'priority-medium';
      case 'HIGH':
        return 'priority-high';
      case 'CRITICAL':
        return 'priority-critical';
      default:
        return '';
    }
  }

  showColorPicker(event: MouseEvent, schedule: Schedule, dayOfWeek: number): void {
    this.selectedScheduleItem = schedule
    this.getPlanById(schedule.planId)
    this.selectedDayOfWeek = dayOfWeek;
    this.showPicker = true;
    this.pickerTop = event.clientY;
    this.pickerLeft = event.clientX;
    event.stopPropagation();
  }

  changeStatusAndColor(status: string): void {
    if (this.selectedPlan && this.selectedDayOfWeek && this.selectedScheduleItem) {
      this.selectedScheduleItem.status = status
      this.selectedPlan.status = status;
      this.selectedPlan.dayOfWeek = this.selectedDayOfWeek;
      console.log(this.selectedPlan)
      console.log(this.plans)
      this.updatePlan(this.selectedPlan)
      if (this.selectedScheduleItem.status === 'DONE' || this.selectedScheduleItem.status === 'NOT_ACTUAL') {
        this.schedule = this.schedule.filter(item => item !== this.selectedScheduleItem);
      }
    }
    this.showPicker = false;
    this.selectedPlan = null;
    this.selectedScheduleItem = null;
    this.selectedDayOfWeek = null;
  }

  public updatePlan(plan: Plan): void {
    this.planService.updatePlan(plan).subscribe({
      next: (): void => {
      }
    });
  }

  toPlan(event: MouseEvent, item: Schedule): void {
    if (event.button == 1) {
      this.router.navigate([`/user/plans/${item.planId}/item`]);
    }
  }

}
