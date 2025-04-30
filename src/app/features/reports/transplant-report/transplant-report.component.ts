import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-transplant-report',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4">
        <button
          routerLink=".."
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <span>Back to Reports</span>
        </button>
      </div>

      <h1 class="text-2xl font-bold mb-6">Transplant Procedures Report</h1>

      <!-- Filter Controls -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <form
          [formGroup]="filterForm"
          class="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date Range</label
            >
            <select
              formControlName="dateRange"
              class="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="last180">Last 180 Days</option>
              <option value="lastYear">Last Year</option>
              <option value="allTime">All Time</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Organ Type</label
            >
            <select
              formControlName="organType"
              class="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All Organs</option>
              <option value="heart">Heart</option>
              <option value="liver">Liver</option>
              <option value="kidney">Kidney</option>
              <option value="lung">Lung</option>
              <option value="pancreas">Pancreas</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Status</label
            >
            <select
              formControlName="status"
              class="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              (click)="applyFilters()"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="loading" class="flex justify-center my-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div *ngIf="!loading">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Total Procedures</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ reportData.metrics.totalProcedures }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Success Rate</p>
            <p class="text-3xl font-bold text-green-600">
              {{ reportData.metrics.successRate }}%
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Avg. Procedure Time</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ reportData.metrics.avgProcedureTime }} hrs
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Scheduled Procedures</p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ reportData.metrics.scheduledProcedures }}
            </p>
          </div>
        </div>

        <!-- Charts and Tables would be here -->
        <!-- In a real application, you would integrate a chart library like Chart.js or ngx-charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Procedures by Organ Type</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Procedures by Month</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        <!-- Recent Transplant Procedures Table -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">
            Recent Transplant Procedures
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">ID</th>
                  <th class="py-3 px-6 text-left">Date</th>
                  <th class="py-3 px-6 text-left">Organ Type</th>
                  <th class="py-3 px-6 text-left">Institution</th>
                  <th class="py-3 px-6 text-left">Doctor</th>
                  <th class="py-3 px-6 text-left">Status</th>
                  <th class="py-3 px-6 text-left">Duration</th>
                  <th class="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let procedure of reportData.recentProcedures"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left">{{ procedure.id }}</td>
                  <td class="py-3 px-6 text-left">
                    {{ procedure.date | date : 'short' }}
                  </td>
                  <td class="py-3 px-6 text-left">{{ procedure.organType }}</td>
                  <td class="py-3 px-6 text-left">
                    {{ procedure.institution }}
                  </td>
                  <td class="py-3 px-6 text-left">{{ procedure.doctor }}</td>
                  <td class="py-3 px-6 text-left">
                    <span
                      [ngClass]="{
                        'bg-green-100 text-green-800':
                          procedure.status === 'completed',
                        'bg-blue-100 text-blue-800':
                          procedure.status === 'scheduled',
                        'bg-yellow-100 text-yellow-800':
                          procedure.status === 'in_progress',
                        'bg-red-100 text-red-800':
                          procedure.status === 'canceled'
                      }"
                      class="py-1 px-2 rounded-full text-xs"
                    >
                      {{ procedure.status | titlecase }}
                    </span>
                  </td>
                  <td class="py-3 px-6 text-left">
                    {{ procedure.duration }} hrs
                  </td>
                  <td class="py-3 px-6 text-center">
                    <a
                      [routerLink]="['/transplant-procedures', procedure.id]"
                      class="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TransplantReportComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;
  reportData: any = {
    metrics: {
      totalProcedures: 0,
      successRate: 0,
      avgProcedureTime: 0,
      scheduledProcedures: 0,
    },
    proceduresByOrgan: [],
    proceduresByMonth: [],
    recentProcedures: [],
  };

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.filterForm = this.fb.group({
      dateRange: ['last30'],
      organType: ['all'],
      status: ['all'],
    });
  }

  ngOnInit(): void {
    this.loadReportData();
  }

  applyFilters(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.loading = true;
    const filters = this.filterForm.value;

    // In production, you would use:
    // this.reportService.getTransplantReport(filters)

    // For development/demonstration, use the mock service:
    this.reportService.getMockTransplantReport(filters).subscribe({
      next: (data) => {
        this.reportData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading report data:', err);
        this.loading = false;
      },
    });
  }
}
