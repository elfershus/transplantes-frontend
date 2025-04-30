// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('organTypeChart') organTypeChart: any;
  @ViewChild('bloodTypeChart') bloodTypeChart: any;
  @ViewChild('statusChart') statusChart: any;

  // Dashboard data
  systemOverview: any = {};
  transplantStats: any = {};
  waitlistStats: any = {};
  recentActivity: any[] = [];
  upcomingProcedures: any[] = [];

  // Loading states
  isLoadingOverview = true;
  isLoadingCharts = true;
  isLoadingTables = true;

  // Chart configurations
  organTypeChartData: ChartData = {
    labels: [],
    datasets: [{ data: [], label: 'Available Organs by Type' }],
  };

  bloodTypeChartData: ChartData = {
    labels: [],
    datasets: [
      { data: [], label: 'Receivers by Blood Type', backgroundColor: [] },
    ],
  };

  statusChartData: ChartData = {
    labels: [],
    datasets: [{ data: [], label: 'Transplants by Status' }],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Update charts after view is initialized
    setTimeout(() => {
      if (this.organTypeChart) {
        this.organTypeChart.update();
      }
      if (this.bloodTypeChart) {
        this.bloodTypeChart.update();
      }
      if (this.statusChart) {
        this.statusChart.update();
      }
    }, 500);
  }

  loadDashboardData(): void {
    // Load system overview
    this.isLoadingOverview = true;
    this.isLoadingCharts = true;
    this.isLoadingTables = true;

    // Use forkJoin to make multiple API calls in parallel
    forkJoin({
      overview: this.http
        .get(`${environment.apiUrl}/reports/overview`)
        .pipe(catchError((error) => of(null))),
      waitlist: this.http
        .get(`${environment.apiUrl}/receivers/statistics/waitlist`)
        .pipe(catchError((error) => of(null))),
      transplants: this.http
        .get(`${environment.apiUrl}/transplant-procedures/statistics`)
        .pipe(catchError((error) => of(null))),
      organStats: this.http
        .get(`${environment.apiUrl}/organs/statistics`)
        .pipe(catchError((error) => of(null))),
      upcoming: this.http
        .get(`${environment.apiUrl}/transplant-procedures/upcoming`)
        .pipe(catchError((error) => of({}))),
    }).subscribe((results) => {
      // Process system overview
      if (results.overview) {
        this.systemOverview = results.overview;
      }

      // Process waitlist statistics
      if (results.waitlist) {
        this.waitlistStats = results.waitlist;
        this.updateBloodTypeChart();
      }

      // Process transplant statistics
      if (results.transplants) {
        this.transplantStats = results.transplants;
        this.updateStatusChart();
      }

      // Process organ statistics
      if (results.organStats) {
        this.updateOrganTypeChart(results.organStats);
      }

      // Process upcoming procedures
      if (results.upcoming && Array.isArray(results.upcoming)) {
        this.upcomingProcedures = results.upcoming.slice(0, 5);
      }

      this.isLoadingOverview = false;
      this.isLoadingCharts = false;
      this.isLoadingTables = false;
    });
  }

  updateOrganTypeChart(organStats: any): void {
    if (organStats && organStats.availableByType) {
      const labels = organStats.availableByType.map((item: any) => item.type);
      const data = organStats.availableByType.map((item: any) => item.count);

      this.organTypeChartData = {
        labels,
        datasets: [
          {
            data,
            label: 'Available Organs by Type',
            backgroundColor: [
              '#4CAF50',
              '#2196F3',
              '#FFC107',
              '#FF5722',
              '#9C27B0',
              '#3F51B5',
            ],
          },
        ],
      };

      if (this.organTypeChart) {
        this.organTypeChart.update();
      }
    }
  }

  updateBloodTypeChart(): void {
    if (this.waitlistStats && this.waitlistStats.byBloodType) {
      const bloodTypes = Object.keys(this.waitlistStats.byBloodType);
      const counts = bloodTypes.map(
        (type) => this.waitlistStats.byBloodType[type]
      );

      this.bloodTypeChartData = {
        labels: bloodTypes,
        datasets: [
          {
            data: counts,
            label: 'Receivers by Blood Type',
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#8BC34A',
              '#607D8B',
            ],
          },
        ],
      };

      if (this.bloodTypeChart) {
        this.bloodTypeChart.update();
      }
    }
  }

  updateStatusChart(): void {
    if (this.transplantStats && this.transplantStats.byOutcome) {
      const outcomes = Object.keys(this.transplantStats.byOutcome);
      const counts = outcomes.map(
        (outcome) => this.transplantStats.byOutcome[outcome]
      );

      this.statusChartData = {
        labels: outcomes,
        datasets: [
          {
            data: counts,
            label: 'Transplants by Outcome',
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#9E9E9E'],
          },
        ],
      };

      if (this.statusChart) {
        this.statusChart.update();
      }
    }
  }
}
