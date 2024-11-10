import { Component } from "@angular/core";
import { Plan } from "../../models/plan";
import { AuthService } from "../../services/auth.service";
import { PlanService } from "../../services/plan-service";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../models/user";
import {FindScheduleRequest} from "../../models/find-schedule-request";
import {DecompositionRequest} from "../../models/decomposition-request";

@Component({
  selector: 'app-plan-item',
  templateUrl: './plan-item.component.html',
  styleUrls: ['./plan-item.component.css']
})
export class PlansItemComponent {
  user: User;
  plan: Plan | null = null;
  isLoading: boolean = false;

  decompositionRequest: DecompositionRequest = {
    planId: 0,
    name: ""
  }

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private route: ActivatedRoute
  ) {
    this.authService.loadUserData();
    this.user = authService.getUser();
    this.route.paramMap.subscribe(params => {
      const planId = params.get('planId');
      if (planId) {
        this.getPlanById(+planId);
      }
    });
  }

  public getPlanById(id: number): void {
    this.planService.getPlanById(id).subscribe({
      next: (plan: Plan): void => {
        this.plan = plan;
      }
    });
  }

  public updatePlan(): void {
    if (this.plan) {
      this.planService.updatePlan(this.plan).subscribe({
        next: (): void => {
          console.log('Plan updated successfully');
        }
      });
    }
  }

  showDecomposition() {
    if (this.plan) {
      this.isLoading = true;
      this.plan.decomposition = ""
      this.decompositionRequest.planId = this.plan.planId;
      this.decompositionRequest.name = this.plan.name;
      this.planService.generateDecomposition(this.decompositionRequest).subscribe({
        next: (plan: Plan): void => {
          this.plan = plan;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
