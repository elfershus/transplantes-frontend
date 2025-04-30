import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-organ-utilization-report',
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

      <h1 class="text-2xl font-bold mb-6">Organ Utilization Report</h1>

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
              >Institution</label
            >
            <select
              formControlName="institutionId"
              class="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All Institutions</option>
              <option value="1">Memorial Hospital</option>
              <option value="2">University Medical Center</option>
              <option value="3">Central Hospital</option>
              <option value="4">Regional Medical Center</option>
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
            <p class="text-gray-500 text-sm">Total Organs Retrieved</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ metrics.totalOrgansRetrieved }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Utilization Rate</p>
            <p class="text-3xl font-bold text-green-600">
              {{ metrics.utilizationRate }}%
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Avg. Preservation Time</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ metrics.avgPreservationTime }} hrs
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Currently Available</p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ metrics.currentlyAvailable }}
            </p>
          </div>
        </div>

        <!-- Charts and Tables would be here -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">
              Organ Utilization by Type
            </h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Organs by Status</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        <!-- Organ Utilization Stats -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h2 class="text-lg font-semibold mb-4">
            Organ Utilization Statistics
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">Organ Type</th>
                  <th class="py-3 px-6 text-center">Retrieved</th>
                  <th class="py-3 px-6 text-center">Transplanted</th>
                  <th class="py-3 px-6 text-center">Utilization Rate</th>
                  <th class="py-3 px-6 text-center">Avg. Preservation (hrs)</th>
                  <th class="py-3 px-6 text-center">Avg. Transport (mins)</th>
                  <th class="py-3 px-6 text-center">Currently Available</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let stat of organStats"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left font-medium">
                    {{ stat.organType }}
                  </td>
                  <td class="py-3 px-6 text-center">{{ stat.retrieved }}</td>
                  <td class="py-3 px-6 text-center">{{ stat.transplanted }}</td>
                  <td class="py-3 px-6 text-center">
                    <span
                      [ngClass]="{
                        'text-green-600': stat.utilizationRate >= 85,
                        'text-yellow-600':
                          stat.utilizationRate >= 70 &&
                          stat.utilizationRate < 85,
                        'text-red-600': stat.utilizationRate < 70
                      }"
                      class="font-medium"
                    >
                      {{ stat.utilizationRate }}%
                    </span>
                  </td>
                  <td class="py-3 px-6 text-center">
                    {{ stat.avgPreservationTime }}
                  </td>
                  <td class="py-3 px-6 text-center">
                    {{ stat.avgTransportTime }}
                  </td>
                  <td class="py-3 px-6 text-center">{{ stat.available }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Preservation Methods Effectiveness -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h2 class="text-lg font-semibold mb-4">
            Preservation Method Effectiveness
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">Preservation Method</th>
                  <th class="py-3 px-6 text-center">Used Count</th>
                  <th class="py-3 px-6 text-center">Success Rate</th>
                  <th class="py-3 px-6 text-center">Avg. Viable Time (hrs)</th>
                  <th class="py-3 px-6 text-center">Organ Types</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let method of preservationMethods"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left font-medium">
                    {{ method.name }}
                  </td>
                  <td class="py-3 px-6 text-center">{{ method.count }}</td>
                  <td class="py-3 px-6 text-center">
                    <span
                      [ngClass]="{
                        'text-green-600': method.successRate >= 90,
                        'text-yellow-600':
                          method.successRate >= 75 && method.successRate < 90,
                        'text-red-600': method.successRate < 75
                      }"
                      class="font-medium"
                    >
                      {{ method.successRate }}%
                    </span>
                  </td>
                  <td class="py-3 px-6 text-center">
                    {{ method.avgViableTime }}
                  </td>
                  <td class="py-3 px-6 text-center">
                    {{ method.organTypes.join(', ') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Available Organs -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Currently Available Organs</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">ID</th>
                  <th class="py-3 px-6 text-left">Type</th>
                  <th class="py-3 px-6 text-left">Institution</th>
                  <th class="py-3 px-6 text-left">Retrieval Date</th>
                  <th class="py-3 px-6 text-left">Preservation Method</th>
                  <th class="py-3 px-6 text-left">Expiration Date</th>
                  <th class="py-3 px-6 text-left">Time Remaining</th>
                  <th class="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let organ of availableOrgans"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left">{{ organ.id }}</td>
                  <td class="py-3 px-6 text-left">{{ organ.type }}</td>
                  <td class="py-3 px-6 text-left">{{ organ.institution }}</td>
                  <td class="py-3 px-6 text-left">
                    {{ organ.retrievalDate | date : 'medium' }}
                  </td>
                  <td class="py-3 px-6 text-left">
                    {{ organ.preservationMethod }}
                  </td>
                  <td class="py-3 px-6 text-left">
                    {{ organ.expirationDate | date : 'medium' }}
                  </td>
                  <td class="py-3 px-6 text-left">
                    <span
                      [ngClass]="{
                        'text-green-600': organ.hoursRemaining > 24,
                        'text-yellow-600':
                          organ.hoursRemaining <= 24 &&
                          organ.hoursRemaining > 6,
                        'text-red-600': organ.hoursRemaining <= 6
                      }"
                      class="font-medium"
                    >
                      {{ organ.hoursRemaining }} hrs
                    </span>
                  </td>
                  <td class="py-3 px-6 text-center">
                    <a
                      [routerLink]="['/organs', organ.id]"
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
export class OrganUtilizationReportComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;

  // Mock data for demonstration
  metrics = {
    totalOrgansRetrieved: 487,
    utilizationRate: 92.4,
    avgPreservationTime: 14.7,
    currentlyAvailable: 24,
  };

  organStats = [
    {
      organType: 'Kidney',
      retrieved: 213,
      transplanted: 198,
      utilizationRate: 93.0,
      avgPreservationTime: 27.3,
      avgTransportTime: 132,
      available: 12,
    },
    {
      organType: 'Liver',
      retrieved: 104,
      transplanted: 96,
      utilizationRate: 92.3,
      avgPreservationTime: 14.2,
      avgTransportTime: 94,
      available: 5,
    },
    {
      organType: 'Heart',
      retrieved: 63,
      transplanted: 59,
      utilizationRate: 93.7,
      avgPreservationTime: 4.8,
      avgTransportTime: 86,
      available: 2,
    },
    {
      organType: 'Lung',
      retrieved: 72,
      transplanted: 65,
      utilizationRate: 90.3,
      avgPreservationTime: 6.1,
      avgTransportTime: 101,
      available: 4,
    },
    {
      organType: 'Pancreas',
      retrieved: 35,
      transplanted: 32,
      utilizationRate: 91.4,
      avgPreservationTime: 12.5,
      avgTransportTime: 113,
      available: 1,
    },
  ];

  preservationMethods = [
    {
      name: 'Static Cold Storage',
      count: 246,
      successRate: 89.1,
      avgViableTime: 16.4,
      organTypes: ['Kidney', 'Liver', 'Pancreas'],
    },
    {
      name: 'Machine Perfusion',
      count: 178,
      successRate: 95.3,
      avgViableTime: 24.7,
      organTypes: ['Kidney', 'Liver'],
    },
    {
      name: 'Hypothermic Machine Perfusion',
      count: 124,
      successRate: 94.2,
      avgViableTime: 22.8,
      organTypes: ['Kidney', 'Liver'],
    },
    {
      name: 'Normothermic Machine Perfusion',
      count: 86,
      successRate: 96.8,
      avgViableTime: 28.3,
      organTypes: ['Liver', 'Heart', 'Lung'],
    },
    {
      name: 'Oxygen Persufflation',
      count: 32,
      successRate: 78.4,
      avgViableTime: 14.6,
      organTypes: ['Kidney'],
    },
  ];

  availableOrgans = [
    {
      id: 'ORG-5427',
      type: 'Kidney',
      institution: 'Memorial Hospital',
      retrievalDate: new Date(Date.now() - 36 * 3600 * 1000), // 36 hours ago
      preservationMethod: 'Machine Perfusion',
      expirationDate: new Date(Date.now() + 48 * 3600 * 1000), // 48 hours from now
      hoursRemaining: 48,
    },
    {
      id: 'ORG-5428',
      type: 'Liver',
      institution: 'University Medical Center',
      retrievalDate: new Date(Date.now() - 10 * 3600 * 1000), // 10 hours ago
      preservationMethod: 'Normothermic Machine Perfusion',
      expirationDate: new Date(Date.now() + 18 * 3600 * 1000), // 18 hours from now
      hoursRemaining: 18,
    },
    {
      id: 'ORG-5429',
      type: 'Heart',
      institution: 'Central Hospital',
      retrievalDate: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
      preservationMethod: 'Normothermic Machine Perfusion',
      expirationDate: new Date(Date.now() + 3 * 3600 * 1000), // 3 hours from now
      hoursRemaining: 3,
    },
    {
      id: 'ORG-5430',
      type: 'Kidney',
      institution: 'Regional Medical Center',
      retrievalDate: new Date(Date.now() - 24 * 3600 * 1000), // 24 hours ago
      preservationMethod: 'Static Cold Storage',
      expirationDate: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours from now
      hoursRemaining: 24,
    },
    {
      id: 'ORG-5431',
      type: 'Lung',
      institution: 'Memorial Hospital',
      retrievalDate: new Date(Date.now() - 5 * 3600 * 1000), // 5 hours ago
      preservationMethod: 'Normothermic Machine Perfusion',
      expirationDate: new Date(Date.now() + 8 * 3600 * 1000), // 8 hours from now
      hoursRemaining: 8,
    },
  ];

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.filterForm = this.fb.group({
      dateRange: ['last30'],
      organType: ['all'],
      institutionId: ['all'],
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
      // this.reportService.getOrganUtilizationReport(this.filterForm.value).subscribe(...)
      this.loading = false;
    }, 1000);
  }
}
