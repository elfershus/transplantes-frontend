import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClinicHistoryService } from '../services/clinic-history.service';
import { ClinicHistory } from '../../../core/models/clinic-history.model';

@Component({
  selector: 'app-clinic-history-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4">
        <button
          (click)="goBack()"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <span>Back to List</span>
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div
        *ngIf="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        role="alert"
      >
        <p>{{ error }}</p>
      </div>

      <div *ngIf="!loading && clinicHistory">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div
            class="flex justify-between items-center px-4 py-5 sm:px-6 bg-gray-50"
          >
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Clinic History Record #{{ clinicHistory.medicalRecordNumber }}
            </h3>
            <button
              [routerLink]="['../edit', clinicHistory.id]"
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Patient Type</dt>
                <dd class="mt-1 text-sm text-gray-900 capitalize">
                  {{ clinicHistory.patientType }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Patient ID</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ clinicHistory.patientId }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">
                  Medical Record Number
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ clinicHistory.medicalRecordNumber }}
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">
                  Primary Physician
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ clinicHistory.primaryPhysician }}
                </dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">
                  Family History
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ clinicHistory.familyHistory }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Clinic Visits Section -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Clinic Visits
            </h3>
          </div>
          <div class="border-t border-gray-200">
            <div
              *ngIf="clinicHistory.visits.length === 0"
              class="p-4 text-center text-gray-500"
            >
              No visits recorded
            </div>
            <div
              *ngIf="clinicHistory.visits.length > 0"
              class="overflow-x-auto"
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doctor
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reason
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Notes
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Follow Up
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let visit of clinicHistory.visits">
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ visit.date | date : 'mediumDate' }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ visit.doctorId }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ visit.reason }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ visit.notes }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      <span *ngIf="visit.followUpNeeded">
                        {{ visit.followUpDate | date : 'mediumDate' }}
                      </span>
                      <span *ngIf="!visit.followUpNeeded">None</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Similar sections for diagnoses, medications, lab results, etc. would follow here -->
        <!-- For brevity, I've only included the visits section as an example -->
      </div>
    </div>
  `,
})
export class ClinicHistoryDetailComponent implements OnInit {
  clinicHistory: ClinicHistory | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clinicHistoryService: ClinicHistoryService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.clinicHistoryService.getClinicHistoryById(+id).subscribe({
        next: (data) => {
          this.clinicHistory = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading clinic history details', err);
          this.error =
            'Failed to load clinic history details. Please try again.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Invalid clinic history ID';
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
