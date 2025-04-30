import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-donor-report',
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

      <h1 class="text-2xl font-bold mb-6">Donor Statistics Report</h1>

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
              >Age Group</label
            >
            <select
              formControlName="ageGroup"
              class="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All Age Groups</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56-65">56-65</option>
              <option value="66+">66+</option>
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
            <p class="text-gray-500 text-sm">Total Donors</p>
            <p class="text-3xl font-bold text-blue-600">
              {{ reportData.metrics.totalDonors }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Active Donors</p>
            <p class="text-3xl font-bold text-green-600">
              {{ reportData.metrics.activeDonors }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Avg. Organs per Donor</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ reportData.metrics.organsPerDonor }}
            </p>
          </div>

          <div class="bg-white p-4 rounded-lg shadow text-center">
            <p class="text-gray-500 text-sm">Avg. Donor Age</p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ reportData.metrics.averageDonorAge }}
            </p>
          </div>
        </div>

        <!-- Charts and Tables would be here -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Donors by Age Group</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Donors by Organ Type</h2>
            <div
              class="h-64 flex items-center justify-center border border-gray-200 rounded"
            >
              <p class="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>

        <!-- Donor Demographics Table -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h2 class="text-lg font-semibold mb-4">Donor Demographics</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-md font-medium mb-2">Donors by Age Group</h3>
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left">Age Group</th>
                    <th class="py-2 px-4 text-right">Count</th>
                    <th class="py-2 px-4 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let group of reportData.donorsByAge"
                    class="border-b"
                  >
                    <td class="py-2 px-4">{{ group.ageGroup }}</td>
                    <td class="py-2 px-4 text-right">{{ group.count }}</td>
                    <td class="py-2 px-4 text-right">
                      {{
                        (group.count / reportData.metrics.totalDonors) * 100
                          | number : '1.1-1'
                      }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 class="text-md font-medium mb-2">Donors by Organ Type</h3>
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left">Organ Type</th>
                    <th class="py-2 px-4 text-right">Count</th>
                    <th class="py-2 px-4 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let type of reportData.donorsByOrganType"
                    class="border-b"
                  >
                    <td class="py-2 px-4">{{ type.organType }}</td>
                    <td class="py-2 px-4 text-right">{{ type.count }}</td>
                    <td class="py-2 px-4 text-right">
                      {{
                        (type.count / getTotalOrgans()) * 100
                          | number : '1.1-1'
                      }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Donors Table -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Recent Donors</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">ID</th>
                  <th class="py-3 px-6 text-left">Name</th>
                  <th class="py-3 px-6 text-left">Age</th>
                  <th class="py-3 px-6 text-left">Blood Type</th>
                  <th class="py-3 px-6 text-left">Organs Donated</th>
                  <th class="py-3 px-6 text-left">Registration Date</th>
                  <th class="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm">
                <tr
                  *ngFor="let donor of mockRecentDonors"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td class="py-3 px-6 text-left">{{ donor.id }}</td>
                  <td class="py-3 px-6 text-left">{{ donor.name }}</td>
                  <td class="py-3 px-6 text-left">{{ donor.age }}</td>
                  <td class="py-3 px-6 text-left">{{ donor.bloodType }}</td>
                  <td class="py-3 px-6 text-left">
                    {{ donor.organsDonated.join(', ') }}
                  </td>
                  <td class="py-3 px-6 text-left">
                    {{ donor.registrationDate | date : 'mediumDate' }}
                  </td>
                  <td class="py-3 px-6 text-center">
                    <a
                      [routerLink]="['/donors', donor.id]"
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
export class DonorReportComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;
  reportData: any = {
    metrics: {
      totalDonors: 0,
      activeDonors: 0,
      organsPerDonor: 0,
      averageDonorAge: 0,
    },
    donorsByAge: [],
    donorsByOrganType: [],
    recentDonors: [],
  };

  // Mock data for the table since the ReportService doesn't have complete mock data
  mockRecentDonors = [
    {
      id: 1001,
      name: 'John Smith',
      age: 45,
      bloodType: 'O+',
      organsDonated: ['Kidney'],
      registrationDate: new Date(2023, 2, 15),
    },
    {
      id: 1002,
      name: 'Maria Garcia',
      age: 38,
      bloodType: 'A-',
      organsDonated: ['Liver'],
      registrationDate: new Date(2023, 3, 22),
    },
    {
      id: 1003,
      name: 'Robert Johnson',
      age: 52,
      bloodType: 'B+',
      organsDonated: ['Kidney', 'Liver'],
      registrationDate: new Date(2023, 1, 8),
    },
    {
      id: 1004,
      name: 'Susan Williams',
      age: 29,
      bloodType: 'AB+',
      organsDonated: ['Lung'],
      registrationDate: new Date(2023, 4, 10),
    },
    {
      id: 1005,
      name: 'David Brown',
      age: 61,
      bloodType: 'O-',
      organsDonated: ['Heart'],
      registrationDate: new Date(2023, 0, 30),
    },
  ];

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.filterForm = this.fb.group({
      dateRange: ['last30'],
      organType: ['all'],
      ageGroup: ['all'],
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
    // this.reportService.getDonorReport(filters)

    // For development/demonstration, use the mock service:
    this.reportService.getMockDonorReport(filters).subscribe({
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

  getTotalOrgans(): number {
    return this.reportData.donorsByOrganType.reduce(
      (total: number, item: any) => total + item.count,
      0
    );
  }
}
