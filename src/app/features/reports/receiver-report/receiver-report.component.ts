import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-receiver-report',
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

      <h1 class="text-2xl font-bold mb-6">Receiver Outcomes Report</h1>

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
              <option value="waiting">Waiting</option>
              <option value="matched">Matched</option>
              <option value="transplanted">Transplanted</option>
              <option value="inactive">Inactive</option>
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
            <p class="text-gray-500 text-sm">Total Receivers</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ metrics.totalReceivers }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Avg. Wait Time</p>
            <p class="text-3xl font-bold text-green-600">
              {{ metrics.avgWaitTime }} days
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Successful Transplants</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ metrics.successfulTransplants }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Currently Waiting</p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ metrics.currentlyWaiting }}
            </p>
          </div>
        </div>

        <!-- Charts and Tables would be here -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Receivers by Organ Type</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Wait Time by Organ Type</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        <!-- Urgency Level Distribution -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h2 class="text-lg font-semibold mb-4">Urgency Level Distribution</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">Urgency Level</th>
                  <th class="py-3 px-6 text-center">Number of Patients</th>
                  <th class="py-3 px-6 text-center">Percentage</th>
                  <th class="py-3 px-6 text-center">Avg. Wait Time (days)</th>
                  <th class="py-3 px-6 text-center">Success Rate</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let level of urgencyLevels"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left">
                    <div class="flex items-center">
                      <span
                        [ngClass]="{
                          'bg-red-100 text-red-800': level.level === 5,
                          'bg-orange-100 text-orange-800': level.level === 4,
                          'bg-yellow-100 text-yellow-800': level.level === 3,
                          'bg-blue-100 text-blue-800': level.level === 2,
                          'bg-green-100 text-green-800': level.level === 1
                        }"
                        class="py-1 px-2 rounded-full text-xs mr-2"
                      >
                        {{ level.level }}
                      </span>
                      {{ level.description }}
                    </div>
                  </td>
                  <td class="py-3 px-6 text-center">{{ level.count }}</td>
                  <td class="py-3 px-6 text-center">{{ level.percentage }}%</td>
                  <td class="py-3 px-6 text-center">{{ level.avgWaitTime }}</td>
                  <td class="py-3 px-6 text-center">
                    {{ level.successRate }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Receivers Table -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">
            Recent Transplant Recipients
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">ID</th>
                  <th class="py-3 px-6 text-left">Name</th>
                  <th class="py-3 px-6 text-left">Age</th>
                  <th class="py-3 px-6 text-left">Blood Type</th>
                  <th class="py-3 px-6 text-left">Organ Needed</th>
                  <th class="py-3 px-6 text-left">Status</th>
                  <th class="py-3 px-6 text-left">Wait Time</th>
                  <th class="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let receiver of recentReceivers"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left">{{ receiver.id }}</td>
                  <td class="py-3 px-6 text-left">{{ receiver.name }}</td>
                  <td class="py-3 px-6 text-left">{{ receiver.age }}</td>
                  <td class="py-3 px-6 text-left">{{ receiver.bloodType }}</td>
                  <td class="py-3 px-6 text-left">
                    {{ receiver.organNeeded }}
                  </td>
                  <td class="py-3 px-6 text-left">
                    <span
                      [ngClass]="{
                        'bg-blue-100 text-blue-800':
                          receiver.status === 'waiting',
                        'bg-yellow-100 text-yellow-800':
                          receiver.status === 'matched',
                        'bg-green-100 text-green-800':
                          receiver.status === 'transplanted',
                        'bg-gray-100 text-gray-800':
                          receiver.status === 'inactive'
                      }"
                      class="py-1 px-2 rounded-full text-xs"
                    >
                      {{ receiver.status | titlecase }}
                    </span>
                  </td>
                  <td class="py-3 px-6 text-left">
                    {{ receiver.waitTime }} days
                  </td>
                  <td class="py-3 px-6 text-center">
                    <a
                      [routerLink]="['/receivers', receiver.id]"
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
export class ReceiverReportComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;

  // Mock data for demonstration
  metrics = {
    totalReceivers: 842,
    avgWaitTime: 187,
    successfulTransplants: 312,
    currentlyWaiting: 418,
  };

  urgencyLevels = [
    {
      level: 5,
      description: 'Critical - Immediate Need',
      count: 42,
      percentage: 10.0,
      avgWaitTime: 21,
      successRate: 89.2,
    },
    {
      level: 4,
      description: 'Urgent - High Priority',
      count: 87,
      percentage: 20.8,
      avgWaitTime: 45,
      successRate: 92.7,
    },
    {
      level: 3,
      description: 'Standard - Medium Priority',
      count: 165,
      percentage: 39.5,
      avgWaitTime: 143,
      successRate: 94.1,
    },
    {
      level: 2,
      description: 'Low Priority',
      count: 96,
      percentage: 23.0,
      avgWaitTime: 276,
      successRate: 96.8,
    },
    {
      level: 1,
      description: 'Minimal Priority',
      count: 28,
      percentage: 6.7,
      avgWaitTime: 354,
      successRate: 98.2,
    },
  ];

  recentReceivers = [
    {
      id: 2001,
      name: 'Emily Johnson',
      age: 42,
      bloodType: 'A+',
      organNeeded: 'Kidney',
      status: 'transplanted',
      waitTime: 134,
    },
    {
      id: 2002,
      name: 'Michael Chen',
      age: 58,
      bloodType: 'O-',
      organNeeded: 'Heart',
      status: 'waiting',
      waitTime: 218,
    },
    {
      id: 2003,
      name: 'Sarah Martinez',
      age: 31,
      bloodType: 'B+',
      organNeeded: 'Liver',
      status: 'matched',
      waitTime: 87,
    },
    {
      id: 2004,
      name: 'James Wilson',
      age: 45,
      bloodType: 'AB+',
      organNeeded: 'Lung',
      status: 'waiting',
      waitTime: 192,
    },
    {
      id: 2005,
      name: 'Linda Thompson',
      age: 62,
      bloodType: 'A-',
      organNeeded: 'Kidney',
      status: 'transplanted',
      waitTime: 243,
    },
  ];

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

    // Simulate API call with delay
    setTimeout(() => {
      // In a real application, this would call the API:
      // this.reportService.getReceiverReport(this.filterForm.value).subscribe(...)
      this.loading = false;
    }, 1000);
  }
}
