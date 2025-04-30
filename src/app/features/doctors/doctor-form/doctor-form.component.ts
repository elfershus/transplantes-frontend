// src/app/features/doctors/doctor-form/doctor-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorsService } from '../services/doctors.service';
import { InstitutionsService } from '../../institutions/services/institutions.service';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">
          {{ isEditMode ? 'Edit' : 'Add' }} Doctor
        </h1>
      </div>

      <div *ngIf="loading" class="flex justify-center my-10">
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

      <form
        [formGroup]="doctorForm"
        (ngSubmit)="onSubmit()"
        class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="col-span-2">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">
              Basic Information
            </h2>
          </div>

          <!-- First Name -->
          <div class="mb-4">
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >First Name</label
            >
            <input
              type="text"
              id="firstName"
              formControlName="firstName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('firstName')
              }"
            />
            <div
              *ngIf="isFieldInvalid('firstName')"
              class="text-red-500 text-sm mt-1"
            >
              First name is required
            </div>
          </div>

          <!-- Last Name -->
          <div class="mb-4">
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Last Name</label
            >
            <input
              type="text"
              id="lastName"
              formControlName="lastName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('lastName')
              }"
            />
            <div
              *ngIf="isFieldInvalid('lastName')"
              class="text-red-500 text-sm mt-1"
            >
              Last name is required
            </div>
          </div>

          <!-- License Number -->
          <div class="mb-4">
            <label
              for="licenseNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >License Number</label
            >
            <input
              type="text"
              id="licenseNumber"
              formControlName="licenseNumber"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('licenseNumber')
              }"
            />
            <div
              *ngIf="isFieldInvalid('licenseNumber')"
              class="text-red-500 text-sm mt-1"
            >
              License number is required
            </div>
          </div>

          <!-- Specialty -->
          <div class="mb-4">
            <label
              for="specialty"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Specialty</label
            >
            <input
              type="text"
              id="specialty"
              formControlName="specialty"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('specialty')
              }"
            />
            <div
              *ngIf="isFieldInvalid('specialty')"
              class="text-red-500 text-sm mt-1"
            >
              Specialty is required
            </div>
          </div>

          <!-- Contact Information -->
          <div class="col-span-2 mt-4">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">
              Contact Information
            </h2>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              type="email"
              id="email"
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('email')
              }"
            />
            <div
              *ngIf="isFieldInvalid('email')"
              class="text-red-500 text-sm mt-1"
            >
              <span *ngIf="doctorForm.get('email')?.errors?.['required']"
                >Email is required</span
              >
              <span *ngIf="doctorForm.get('email')?.errors?.['email']"
                >Email format is invalid</span
              >
            </div>
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Phone</label
            >
            <input
              type="tel"
              id="phone"
              formControlName="phone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('phone')
              }"
            />
            <div
              *ngIf="isFieldInvalid('phone')"
              class="text-red-500 text-sm mt-1"
            >
              Phone number is required
            </div>
          </div>

          <!-- Institution Information -->
          <div class="col-span-2 mt-4">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">
              Institution Information
            </h2>
          </div>

          <!-- Institution -->
          <div class="mb-4">
            <label
              for="institution"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Institution</label
            >
            <input
              type="text"
              id="institution"
              formControlName="institution"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('institution')
              }"
            />
            <div
              *ngIf="isFieldInvalid('institution')"
              class="text-red-500 text-sm mt-1"
            >
              Institution is required
            </div>
          </div>

          <!-- Department -->
          <div class="mb-4">
            <label
              for="department"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Department</label
            >
            <input
              type="text"
              id="department"
              formControlName="department"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('department')
              }"
            />
            <div
              *ngIf="isFieldInvalid('department')"
              class="text-red-500 text-sm mt-1"
            >
              Department is required
            </div>
          </div>

          <!-- Professional Experience -->
          <div class="col-span-2 mt-4">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">
              Professional Experience
            </h2>
          </div>

          <!-- Years of Experience -->
          <div class="mb-4">
            <label
              for="yearsOfExperience"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Years of Experience</label
            >
            <input
              type="number"
              id="yearsOfExperience"
              formControlName="yearsOfExperience"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              [ngClass]="{
                'border-red-500': isFieldInvalid('yearsOfExperience')
              }"
            />
            <div
              *ngIf="isFieldInvalid('yearsOfExperience')"
              class="text-red-500 text-sm mt-1"
            >
              Years of experience is required
            </div>
          </div>

          <!-- Availability -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Availability</label
            >
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  formControlName="isAvailable"
                  [value]="true"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Available</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  formControlName="isAvailable"
                  [value]="false"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Not Available</span>
              </label>
            </div>
          </div>

          <!-- Organ Specialties -->
          <div class="col-span-2 mt-4">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">
              Specialization
            </h2>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Organ Specialties</label
              >
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  *ngFor="let organType of organTypeOptions"
                  class="inline-block"
                >
                  <label
                    class="inline-flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      [value]="organType"
                      (change)="onOrganSpecialtyChange($event)"
                      [checked]="isOrganSpecialtySelected(organType)"
                      class="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span class="ml-2">{{ organType }}</span>
                  </label>
                </div>
              </div>
              <div
                *ngIf="
                  doctorForm.get('organSpecialties')?.value.length === 0 &&
                  doctorForm.get('organSpecialties')?.touched
                "
                class="text-red-500 text-sm mt-1"
              >
                At least one organ specialty must be selected
              </div>
            </div>
          </div>

          <!-- Certifications -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Certifications</label
            >

            <div formArrayName="certifications" class="mb-4">
              <div
                *ngFor="let cert of certificationsArray.controls; let i = index"
                class="flex items-center mb-2"
              >
                <input
                  [formControlName]="i"
                  class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Certification name"
                />
                <button
                  type="button"
                  (click)="removeCertification(i)"
                  class="ml-2 bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              </div>

              <button
                type="button"
                (click)="addCertification()"
                class="mt-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="mt-8 flex justify-between">
          <button
            type="button"
            (click)="goBack()"
            class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="doctorForm.invalid || submitting"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {{ isEditMode ? 'Update' : 'Create' }} Doctor
          </button>
        </div>
      </form>
    </div>
  `,
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  error: string | null = null;
  doctorId: number | null = null;
  isSaving = false;
  institutions: any[] = [];

  organTypeOptions = [
    'Kidney',
    'Liver',
    'Heart',
    'Lung',
    'Pancreas',
    'Intestine',
    'Cornea',
    'Bone Marrow',
  ];

  constructor(
    private fb: FormBuilder,
    private doctorsService: DoctorsService,
    private institutionsService: InstitutionsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInstitutions();

    // Check if we're editing an existing doctor
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.doctorId = +id;
      this.loadDoctor(this.doctorId);

      // Password not required when editing
      this.doctorForm.get('password')?.setValidators(null);
    } else {
      // Password required for new doctors
      this.doctorForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(8)]);
    }

    this.doctorForm.get('password')?.updateValueAndValidity();
  }

  loadInstitutions(): void {
    this.institutionsService.getInstitutions({ limit: 100 }).subscribe({
      next: (response) => {
        this.institutions = response.items;
      },
      error: () => {
        this.snackBar.open('Error loading institutions', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  loadDoctor(id: number): void {
    this.loading = true;

    this.doctorsService.getDoctor(id).subscribe({
      next: (doctor) => {
        // Extract institution IDs if available
        const institutionIds =
          doctor.institutions?.map((inst) => inst.id) || [];

        // Update form with doctor data
        this.doctorForm.patchValue({
          ...doctor,
          institutionIds,
        });

        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading doctor', 'Close', { duration: 5000 });
        this.loading = false;
        this.router.navigate(['/doctors']);
      },
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.doctorForm.controls).forEach((key) => {
        const control = this.doctorForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.doctorId) {
      this.updateDoctor();
    } else {
      this.createDoctor();
    }
  }

  createDoctor(): void {
    this.doctorsService.createDoctor(this.doctorForm.value).subscribe({
      next: () => {
        this.snackBar.open('Doctor created successfully', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/doctors']);
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Error creating doctor',
          'Close',
          { duration: 5000 }
        );
        this.isSaving = false;
      },
    });
  }

  updateDoctor(): void {
    if (!this.doctorId) return;

    // If password is empty, remove it from the payload
    const formData = { ...this.doctorForm.value };
    if (!formData.password) {
      delete formData.password;
    }

    this.doctorsService.updateDoctor(this.doctorId, formData).subscribe({
      next: () => {
        this.snackBar.open('Doctor updated successfully', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/doctors']);
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Error updating doctor',
          'Close',
          { duration: 5000 }
        );
        this.isSaving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/doctors']);
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      department: ['', [Validators.required]],
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      isAvailable: [true],
      organSpecialties: [[], [Validators.required, Validators.minLength(1)]],
      certifications: this.fb.array([]),
    });
  }

  get certificationsArray(): FormArray {
    return this.doctorForm.get('certifications') as FormArray;
  }

  addCertification(value = ''): void {
    this.certificationsArray.push(this.fb.control(value, Validators.required));
  }

  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  onOrganSpecialtyChange(event: any): void {
    const organSpecialties = this.doctorForm.get('organSpecialties')
      ?.value as string[];
    const organType = event.target.value;

    if (event.target.checked) {
      // Add organ type if not already in the array
      if (organSpecialties.indexOf(organType) === -1) {
        this.doctorForm.patchValue({
          organSpecialties: [...organSpecialties, organType],
        });
      }
    } else {
      // Remove organ type
      this.doctorForm.patchValue({
        organSpecialties: organSpecialties.filter((type) => type !== organType),
      });
    }

    // Mark as touched to trigger validation
    this.doctorForm.get('organSpecialties')?.markAsTouched();
  }

  isOrganSpecialtySelected(organType: string): boolean {
    const organSpecialties = this.doctorForm.get('organSpecialties')
      ?.value as string[];
    return organSpecialties.includes(organType);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  goBack(): void {
    this.router.navigate(['/doctors']);
  }
}
