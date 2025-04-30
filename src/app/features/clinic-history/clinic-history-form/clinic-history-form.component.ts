import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClinicHistoryService } from '../services/clinic-history.service';
import { ClinicHistory } from '../../../core/models/clinic-history.model';

@Component({
  selector: 'app-clinic-history-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4">
        <button
          (click)="goBack()"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <span>Back</span>
        </button>
      </div>

      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl font-bold mb-6">
          {{ isEditMode ? 'Edit' : 'Add' }} Clinic History
        </h2>

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

        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!loading">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="patientType"
              >
                Patient Type *
              </label>
              <select
                id="patientType"
                formControlName="patientType"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select patient type</option>
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
              </select>
              <p
                *ngIf="
                  form.get('patientType')?.invalid &&
                  form.get('patientType')?.touched
                "
                class="text-red-500 text-xs italic"
              >
                Patient type is required
              </p>
            </div>

            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="patientId"
              >
                Patient ID *
              </label>
              <input
                id="patientId"
                type="number"
                formControlName="patientId"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p
                *ngIf="
                  form.get('patientId')?.invalid &&
                  form.get('patientId')?.touched
                "
                class="text-red-500 text-xs italic"
              >
                Patient ID is required
              </p>
            </div>

            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="medicalRecordNumber"
              >
                Medical Record Number *
              </label>
              <input
                id="medicalRecordNumber"
                type="text"
                formControlName="medicalRecordNumber"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p
                *ngIf="
                  form.get('medicalRecordNumber')?.invalid &&
                  form.get('medicalRecordNumber')?.touched
                "
                class="text-red-500 text-xs italic"
              >
                Medical record number is required
              </p>
            </div>

            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="primaryPhysician"
              >
                Primary Physician *
              </label>
              <input
                id="primaryPhysician"
                type="number"
                formControlName="primaryPhysician"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p
                *ngIf="
                  form.get('primaryPhysician')?.invalid &&
                  form.get('primaryPhysician')?.touched
                "
                class="text-red-500 text-xs italic"
              >
                Primary physician is required
              </p>
            </div>

            <div class="mb-4 md:col-span-2">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="familyHistory"
              >
                Family History
              </label>
              <textarea
                id="familyHistory"
                formControlName="familyHistory"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
          </div>

          <!-- Note: In a real application, you would have additional fields and sections for adding visits, diagnoses, etc. -->

          <div class="flex items-center justify-end mt-6">
            <button
              type="button"
              (click)="goBack()"
              class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || submitting"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ClinicHistoryFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  clinicHistoryId?: number;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clinicHistoryService: ClinicHistoryService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clinicHistoryId = +id;
      this.loadClinicHistory(this.clinicHistoryId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      patientType: ['', Validators.required],
      patientId: ['', Validators.required],
      medicalRecordNumber: ['', Validators.required],
      primaryPhysician: ['', Validators.required],
      familyHistory: [''],
      // In a real app, we would include form arrays for visits, diagnoses, etc.
    });
  }

  loadClinicHistory(id: number): void {
    this.loading = true;
    this.clinicHistoryService.getClinicHistoryById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          patientType: data.patientType,
          patientId: data.patientId,
          medicalRecordNumber: data.medicalRecordNumber,
          primaryPhysician: data.primaryPhysician,
          familyHistory: data.familyHistory,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading clinic history', err);
        this.error = 'Failed to load clinic history. Please try again.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const formData = this.form.value;

    // Create a simplified clinic history object (in a real app, we would handle nested data properly)
    const clinicHistory: Partial<ClinicHistory> = {
      patientType: formData.patientType,
      patientId: formData.patientId,
      medicalRecordNumber: formData.medicalRecordNumber,
      primaryPhysician: formData.primaryPhysician,
      familyHistory: formData.familyHistory,
      visits: [],
      diagnoses: [],
      medications: [],
      allergies: [],
      immunizations: [],
      surgicalHistory: [],
      labResults: [],
      imagingResults: [],
    };

    if (this.isEditMode && this.clinicHistoryId) {
      this.clinicHistoryService
        .updateClinicHistory(
          this.clinicHistoryId,
          clinicHistory as ClinicHistory
        )
        .subscribe({
          next: () => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          },
          error: (err) => {
            console.error('Error updating clinic history', err);
            this.error = 'Failed to update clinic history. Please try again.';
            this.submitting = false;
          },
        });
    } else {
      this.clinicHistoryService
        .createClinicHistory(clinicHistory as ClinicHistory)
        .subscribe({
          next: () => {
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (err) => {
            console.error('Error creating clinic history', err);
            this.error = 'Failed to create clinic history. Please try again.';
            this.submitting = false;
          },
        });
    }
  }

  goBack(): void {
    if (this.isEditMode) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
