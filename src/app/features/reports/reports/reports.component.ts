// src/app/features/reports/reports/reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    NgChartsModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // Form groups
  filterForm: FormGroup;
  exportForm: FormGroup;
  
  // Loading states
  isLoading = {
    transplants: false,
    waitlist: false,
    matching: false,
    transportation: false,
    export: false
  };
  
  // Data
  transplantStats: any = null;
  waitlistStats: any = null;
  matchingStats: any = null;
  transportationStats: any = null;
  
  // Charts config
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  
  // Chart data
  transplantChartData: ChartData = {
    labels: [],
    datasets: []
  };
  
  waitlistChartData: ChartData = {
    labels: [],
    datasets: []
  };
  
  matchingChartData: ChartData = {
    labels: [],
    datasets: []
  };
  
  transportationChartData: ChartData = {
    labels: [],
    datasets: []
  };
  
  // Chart types
  barChartType: ChartType = 'bar';
  pieChartType: ChartType = 'pie';
  lineChartType: ChartType = 'line';
  
  // Export options
  reportTypes = [
    { value: 'overview', label: 'System Overview' },
    { value: 'transplants', label: 'Transplant Statistics' },
    { value: 'waitlist', label: 'Waitlist Statistics' },
    { value: 'matches', label: 'Organ Matching Statistics' },
    { value: 'transportation', label: 'Transportation Efficiency' }
  ];
  
  exportFormats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {
    // Initialize filter form
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    this.filterForm = this.fb.group({
      startDate: [threeMonthsAgo],
      endDate: [today]
    });
    
    // Initialize export form
    this.exportForm = this.fb.group({
      reportType: ['overview'],
      format: ['pdf'],
      startDate: [threeMonthsAgo],
      endDate: [today]
    });
  }
  
  ngOnInit(): void {
    this.loadAllReports();
    
    // React to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.loadTransplantStats();
    });
  }
  
  loadAllReports(): void {
    this.loadTransplantStats();
    this.loadWaitlistStats();
    this.loadMatchingStats();
    this.loadTransportationStats();
  }
  
  loadTransplantStats(): void {
    this.isLoading.transplants = true;
    
    const { startDate, endDate } = this.filterForm.value;
    
    this.reportsService.getTransplantStatistics(startDate, endDate).subscribe({
      next: (data) => {
        this.transplantStats = data;
        this.updateTransplantCharts();
        this.isLoading.transplants = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading transplant statistics', 'Close', { duration: 5000 });
        this.isLoading.transplants = false;
      }
    });
  }
  
  loadWaitlistStats(): void {
    this.isLoading.waitlist = true;
    
    this.reportsService.getWaitlistStatistics().subscribe({
      next: (data) => {
        this.waitlistStats = data;
        this.updateWaitlistCharts();
        this.isLoading.waitlist = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading waitlist statistics', 'Close', { duration: 5000 });
        this.isLoading.waitlist = false;
      }
    });
  }
  
  loadMatchingStats(): void {
    this.isLoading.matching = true;
    
    this.reportsService.getOrganMatchingStatistics().subscribe({
      next: (data) => {
        this.matchingStats = data;
        this.updateMatchingCharts();
        this.isLoading.matching = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading matching statistics', 'Close', { duration: 5000 });
        this.isLoading.matching = false;
      }
    });
  }
  
  loadTransportationStats(): void {
    this.isLoading.transportation = true;
    
    this.reportsService.getTransportationEfficiencyReport().subscribe({
      next: (data) => {
        this.transportationStats = data;
        this.updateTransportationCharts();
        this.isLoading.transportation = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading transportation statistics', 'Close', { duration: 5000 });
        this.isLoading.transportation = false;
      }
    });
  }
  
  updateTransplantCharts(): void {
    if (this.transplantStats?.byOrganType) {
      const organTypes = Object.keys(this.transplantStats.byOrganType);
      const counts = organTypes.map(type => this.transplantStats.byOrganType[type]);
      
      this.transplantChartData = {
        labels: organTypes,
        datasets: [{
          data: counts,
          label: 'Transplants by Organ Type',
          backgroundColor: [
            '#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5'
          ]
        }]
      };
    }
  }
  
  updateWaitlistCharts(): void {
    if (this.waitlistStats?.byBloodType && this.waitlistStats?.byUrgencyLevel) {
      const bloodTypes = Object.keys(this.waitlistStats.byBloodType);
      const bloodTypeCounts = bloodTypes.map(type => this.waitlistStats.byBloodType[type]);
      
      const urgencyLevels = Object.keys(this.waitlistStats.byUrgencyLevel);
      const urgencyCounts = urgencyLevels.map(level => this.waitlistStats.byUrgencyLevel[level]);
      
      this.waitlistChartData = {
        labels: bloodTypes,
        datasets: [{
          data: bloodTypeCounts,
          label: 'Recipients by Blood Type',
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A', '#607D8B'
          ]
        }]
      };
    }
  }
  
  updateMatchingCharts(): void {
    if (this.matchingStats?.averageScoresByStatus) {
      const statuses = Object.keys(this.matchingStats.averageScoresByStatus);
      const scores = statuses.map(status => this.matchingStats.averageScoresByStatus[status]);
      
      this.matchingChartData = {
        labels: statuses,
        datasets: [{
          data: scores,
          label: 'Average Match Scores by Status',
          backgroundColor: [
            '#4CAF50', '#F44336', '#FFC107', '#9E9E9E'
          ]
        }]
      };
    }
  }
  
  updateTransportationCharts(): void {
    if (this.transportationStats?.byTransportMethod) {
      const methods = Object.keys(this.transportationStats.byTransportMethod);
      const avgTimes = methods.map(method => this.transportationStats.byTransportMethod[method].avgTime);
      
      this.transportationChartData = {
        labels: methods,
        datasets: [{
          data: avgTimes,
          label: 'Average Transport Time by Method (minutes)',
          backgroundColor: [
            '#4CAF50', '#2196F3', '#FFC107', '#FF5722'
          ]
        }]
      };
    }
  }
  
  exportReport(): void {
    this.isLoading.export = true;
    
    const { reportType, format, startDate, endDate } = this.exportForm.value;
    
    this.reportsService.exportReport(reportType, format, startDate, endDate).subscribe({
      next: (blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Report downloaded successfully', 'Close', { duration: 5000 });
        this.isLoading.export = false;
      },
      error: (error) => {
        this.snackBar.open('Error exporting report', 'Close', { duration: 5000 });
        this.isLoading.export = false;
      }
    });
  }
}