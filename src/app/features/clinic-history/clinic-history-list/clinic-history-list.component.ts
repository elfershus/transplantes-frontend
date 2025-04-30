import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClinicHistoryService } from '../services/clinic-history.service';
import { ClinicHistory } from '../../../core/models/clinic-history.model';

@Component({
  selector: 'app-clinic-history-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Clinic History Records</h1>
        <button
          routerLink="new"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Record
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

      <div
        *ngIf="!loading && clinicHistories.length === 0"
        class="text-center py-8"
      >
        <p class="text-gray-500">No clinic history records found</p>
      </div>

      <div
        *ngIf="!loading && clinicHistories.length > 0"
        class="overflow-x-auto"
      >
        <table class="min-w-full bg-white">
          <thead>
            <tr
              class="bg-gray-100 text-gray-700 uppercase text-sm leading-normal"
            >
              <th class="py-3 px-6 text-left">ID</th>
              <th class="py-3 px-6 text-left">Patient Type</th>
              <th class="py-3 px-6 text-left">Patient ID</th>
              <th class="py-3 px-6 text-left">Record Number</th>
              <th class="py-3 px-6 text-left">Primary Physician</th>
              <th class="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm">
            <tr
              *ngFor="let history of clinicHistories"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6 text-left">{{ history.id }}</td>
              <td class="py-3 px-6 text-left capitalize">
                {{ history.patientType }}
              </td>
              <td class="py-3 px-6 text-left">{{ history.patientId }}</td>
              <td class="py-3 px-6 text-left">
                {{ history.medicalRecordNumber }}
              </td>
              <td class="py-3 px-6 text-left">
                {{ history.primaryPhysician }}
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center">
                  <button
                    [routerLink]="[history.id]"
                    class="transform hover:text-blue-500 hover:scale-110 mr-3"
                  >
                    <i class="fas fa-eye"></i>
                    View
                  </button>
                  <button
                    [routerLink]="[history.id, 'edit']"
                    class="transform hover:text-yellow-500 hover:scale-110 mr-3"
                  >
                    <i class="fas fa-edit"></i>
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ClinicHistoryListComponent implements OnInit {
  clinicHistories: ClinicHistory[] = [];
  loading = false;
  error: string | null = null;

  constructor(private clinicHistoryService: ClinicHistoryService) {}

  ngOnInit(): void {
    this.loadClinicHistories();
  }

  loadClinicHistories(): void {
    this.loading = true;
    this.error = null;

    this.clinicHistoryService.getAllClinicHistories().subscribe({
      next: (data) => {
        this.clinicHistories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading clinic history records', err);
        this.error = 'Failed to load clinic history records. Please try again.';
        this.loading = false;
      },
    });
  }
}
