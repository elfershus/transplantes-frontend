// src/app/features/doctors/doctor-form/doctor-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    MatSnackBarModule
  ],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditing = false;
  doctorId: number | null = null;
  isLoading = false;
  isSaving = false;
  institutions: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private doctorsService: DoctorsService,
    private institutionsService: InstitutionsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.minLength(8)]],
      institutionIds: [[]]
    });
  }
  
  ngOnInit(): void {
    this.loadInstitutions();
    
    // Check if we're editing an existing doctor
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.doctorId = +id;
      this.loadDoctor(this.doctorId);
      
      // Password not required when editing
      this.doctorForm.get('password')?.setValidators(null);
    } else {
      // Password required for new doctors
      this.doctorForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    
    this.doctorForm.get('password')?.updateValueAndValidity();
  }
  
  loadInstitutions(): void {
    this.institutionsService.getInstitutions({ limit: 100 }).subscribe({
      next: (response) => {
        this.institutions = response.items;
      },
      error: () => {
        this.snackBar.open('Error loading institutions', 'Close', { duration: 5000 });
      }
    });
  }
  
  loadDoctor(id: number): void {
    this.isLoading = true;
    
    this.doctorsService.getDoctor(id).subscribe({
      next: (doctor) => {
        // Remove password from form values
        const { password, ...formValues } = doctor;
        
        // Extract institution IDs if available
        const institutionIds = doctor.institutions?.map(inst => inst.id) || [];
        
        // Update form with doctor data
        this.doctorForm.patchValue({
          ...formValues,
          institutionIds
        });
        
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading doctor', 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/doctors']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.doctorForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    if (this.isEditing && this.doctorId) {
      this.updateDoctor();
    } else {
      this.createDoctor();
    }
  }
  
  createDoctor(): void {
    this.doctorsService.createDoctor(this.doctorForm.value).subscribe({
      next: () => {
        this.snackBar.open('Doctor created successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/doctors']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating doctor', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
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
        this.snackBar.open('Doctor updated successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/doctors']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating doctor', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/doctors']);
  }
}