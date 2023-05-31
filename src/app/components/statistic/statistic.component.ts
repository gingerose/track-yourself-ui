import {Component, OnInit} from '@angular/core';
import {ChartConfiguration, ChartType, ChartData, ChartOptions} from 'chart.js';
import {StatisticRequest} from "../../models/StatisticRequest";
import {AuthService} from "../../services/auth.service";
import {StatisticPlans} from "../../models/StatisticPlans";
import {Plan} from "../../models/plan";
import {StatisticService} from "../../services/statistic-service";
import {StatisticCollections} from "../../models/StatisticCollections";
import {StatisticHabits} from "../../models/StatisticHabits";
import {Subscription} from "rxjs";

interface CustomChartConfiguration<TType extends ChartType, TData, TLabel> {
  type: TType;
  data: ChartData<TType, TData, TLabel>;
  options?: ChartOptions<TType>;
  plugins?: any[];
}

interface CustomChartData extends ChartData<'pie', number[], string> {
  labels: string[];
}

interface ChartDataset {
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  statisticRequest: StatisticRequest = {
    date: new Date(),
    userId: +this.authService.getUserId(),
    year: false
  }
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  dataPlans: StatisticPlans[] = [];
  dataCollections: StatisticCollections[] = [];
  dataHabits: StatisticHabits[] = [];

  public myChartConfig: CustomChartConfiguration<'pie', number[], string> | undefined
  public barCollectionsChartConfig: ChartConfiguration<'bar', CustomChartData> | undefined
  public barHabitsChartConfig: ChartConfiguration<'bar', CustomChartData> | undefined

  ngOnInit(): void {
    this.getStatisticPlans();
    this.getStatisticCollections();
    this.getStatisticHabits();
  }

  constructor(private authService: AuthService, private statisticService: StatisticService) {
    this.authService.loadUserData()
  }

  public getStatisticPlans(): void {
    this.statisticService.statisticPlans(this.statisticRequest).subscribe({
      next: (statistic: StatisticPlans[]): void => {
        this.dataPlans = statistic
        this.createPie()
      }
    });
  }

  public getStatisticCollections(): void {
    this.statisticService.statisticCollections(this.statisticRequest).subscribe({
      next: (statistic: StatisticCollections[]): void => {
        this.dataCollections = statistic
        this.createCollectionsBar();
      }
    });
  }

  public getStatisticHabits(): void {
    this.statisticService.statisticHabits(this.statisticRequest).subscribe({
      next: (statistic: StatisticHabits[]): void => {
        this.dataHabits = statistic
        this.createHabitsBar();
      }
    });
  }

  createPie() {
    this.myChartConfig = {
      type: 'pie',
      data: {
        labels: this.dataPlans.map(item => item.status),
        datasets: [
          {
            data: this.dataPlans.map(item => item.amount),
            backgroundColor: ['rgba(75, 192, 192, 0.5)', '#B3E2B1', '#E7E9ED', '#FCE592', '#F9917A'],
            hoverBackgroundColor: ['rgba(75, 192, 192, 0.5)', '#B3E2B1', '#E7E9ED', '#FCE592', '#F9917A']
          }
        ]
      },
      options: {
        responsive: true
      }
    };
  }

  createCollectionsBar() {
    this.barCollectionsChartConfig = {
      type: 'bar',
      data: {
        labels: this.dataCollections.map(item => item.title),
        datasets: [
          {
            label: 'Full Amount',
            // @ts-ignore
            data: this.dataCollections.map(item => item.fullAmount),
            backgroundColor: '#BECAC1',
            borderColor: '#BECAC1',
            borderWidth: 1
          },
          {
            label: 'Amount of Done',
            // @ts-ignore
            data: this.dataCollections.map(item => item.amountOfDone),
            backgroundColor: '#6DDC87',
            borderColor: '#6DDC87',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  createHabitsBar() {
    this.barHabitsChartConfig = {
      type: 'bar',
      data: {
        labels: this.dataHabits.map(item => item.title),
        datasets: [
          {
            label: 'Amount of done',
            // @ts-ignore
            data: this.dataHabits.map(item => item.amountOfDone),
            backgroundColor: '#6DDC87',
            borderColor: '#6DDC87',
            borderWidth: 1
          },
          {
            label: 'Amount of Empty',
            // @ts-ignore
            data: this.dataHabits.map(item => item.amountOfEmpty),
            backgroundColor: '#F9917A',
            borderColor: '#F9917A',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  submitSearch() {
    this.getStatisticPlans();
    this.getStatisticCollections();
    this.getStatisticHabits();
  }
}
