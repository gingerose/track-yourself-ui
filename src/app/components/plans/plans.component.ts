import {Component} from '@angular/core';
import {Plan} from '../../models/plan';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {PlanService} from "../../services/plan-service";
import {FindPlansRequest} from "../../models/find-plans-request";

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent {
  daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Su', 'Sn'];

  showPicker = false;
  pickerTop = 0;
  pickerLeft = 0;
  selectedPlan: Plan | null = null;
  selectedDayOfWeek: number | null = null;
  user: User
  plans: Plan[] = []
  findPlansRequest: FindPlansRequest = {
    userId: 0,
    description: "",
    status: "",
    date: new Date()
  }

  showPopup: boolean = false;
  newPlan: Plan = {
    planId: 0,
    userId: 0,
    description: "",
    status: "EMPTY",
    date: new Date(),
    dayOfWeek: -1
  };

  showDeletePopup: boolean = false;
  planToDelete: any;
  weekDates: Date[] = [];

  constructor(private authService: AuthService, private planService: PlanService) {
    this.user = authService.getUser();
    this.findPlansRequest.userId = this.user.userId
    this.getDates(this.findPlansRequest.date)
    for (const date of this.weekDates) {
      console.log(date.toDateString());
    }
    this.getPlans();
  }

  getStatusColor(plan: Plan, currentDayOfWeek: number): string {
    if (plan.dayOfWeek === currentDayOfWeek) {
      switch (plan.status) {
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

  showColorPicker(event: MouseEvent, plan: Plan, dayOfWeek: number): void {
    this.selectedPlan = plan;
    this.selectedDayOfWeek = dayOfWeek;
    this.showPicker = true;
    this.pickerTop = event.clientY;
    this.pickerLeft = event.clientX;
    event.stopPropagation();
  }


  changeStatusAndColor(status: string): void {
    if (this.selectedPlan && this.selectedDayOfWeek) {
      this.selectedPlan.status = status;
      this.selectedPlan.dayOfWeek = this.selectedDayOfWeek;
      this.updatePlan(this.selectedPlan)
    }
    this.showPicker = false;
    this.selectedPlan = null;
    this.selectedDayOfWeek = null;
  }

  editedDescription: string | undefined;

  isEditing(plan: Plan): boolean {
    return this.editedDescription !== undefined && this.editedDescription !== '' && plan === this.selectedPlan;
  }

  startEditing(plan: Plan): void {
    this.editedDescription = plan.description;
    this.selectedPlan = plan;
  }

  stopEditing(plan: Plan): void {
    if (this.editedDescription !== undefined) {
      plan.description = this.editedDescription;
      this.editedDescription = undefined;
      this.updatePlan(plan)
    }
    this.selectedPlan = {
      planId: 0,
      userId: 0,
      description: "",
      status: "EMPTY",
      date: new Date(),
      dayOfWeek: -1
    };
  }

  public getPlans(): void {
    this.planService.getPlans(this.findPlansRequest).subscribe({
      next: (plans: Plan[]): void => {
        this.plans = plans
        this.getDates(this.findPlansRequest.date);
      }
    });
  }

  public updatePlan(plan: Plan): void {
    this.planService.updatePlan(plan).subscribe({
      next: (): void => {
      }
    });
  }

  public addPlanApi(plan: Plan): void {
    this.planService.addPlan(plan).subscribe({
      next: (): void => {
      }
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  onDateChange(value: string) {
    this.newPlan.date = new Date(value);
  }

  addPlan() {
    this.newPlan.userId = this.user.userId;
    this.newPlan.dayOfWeek = (this.newPlan.date.getUTCDay() + 6) % 7 + 1;
    this.addPlanApi(this.newPlan);
    const desiredDate = new Date(this.newPlan.date);
    let isDateIncluded = false;

    for (let i = 0; i < this.weekDates.length; i++) {
      const currentDate = this.weekDates[i];
      if (
        currentDate.getFullYear() === desiredDate.getFullYear() &&
        currentDate.getMonth() === desiredDate.getMonth() &&
        currentDate.getDate() === desiredDate.getDate()
      ) {
        isDateIncluded = true;
        break;
      }
    }

    if (isDateIncluded) {
      this.plans.push(this.newPlan);
    }

    this.showPopup = false;
    this.newPlan = {
      planId: 0,
      userId: 0,
      description: "",
      status: "EMPTY",
      date: new Date(),
      dayOfWeek: -1
    };
  }

  cancel() {
    this.showPopup = false;
  }

  dateToString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  confirmDelete(plan: any) {
    this.planToDelete = plan;
    this.showDeletePopup = true;
  }

  deletePlan() {
    const index = this.plans.indexOf(this.planToDelete);
    if (index !== -1) {
      this.plans.splice(index, 1);
      this.deletePlanApi(this.planToDelete.planId)
    }
    this.showDeletePopup = false;
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  deletePlanApi(planId: number): void {
    this.planService.deletePlan(planId).subscribe({
      next: (): void => {
      }
    });
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
    this.getPlans()
  }
}
