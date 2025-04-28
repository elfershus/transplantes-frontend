// src/app/features/institutions/institution-form/institution-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Institution } from '../../../core/models/institution.model';
import { InstitutionsService } from '../services/institutions.service';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.scss']
})
export class InstitutionFormComponent implements OnInit {
  institutionForm: FormGroup;
  isEditing = false;
  institutionId: number | null = null;
  isLoading = false;
  isSaving = false;
  
  constructor(
    private fb: FormBuilder,
    private institutionsService: InstitutionsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.institutionForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['']
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.institutionId = +id;
      this.loadInstitution(this.institutionId);
    }
  }
  
  loadInstitution(id: number): void {
    this.isLoading = true;
    
    this.institutionsService.getInstitution(id).subscribe({
      next: (institution) => {
        this.institutionForm.patchValue(institution);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading institution', 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/institutions']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.institutionForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    if (this.isEditing && this.institutionId) {
      this.updateInstitution();
    } else {
      this.createInstitution();
    }
  }
  
  createInstitution(): void {
    this.institutionsService.createInstitution(this.institutionForm.value).subscribe({
      next: () => {
        this.snackBar.open('Institution created successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/institutions']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating institution', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  updateInstitution(): void {
    if (!this.institutionId) return;
    
    this.institutionsService.updateInstitution(this.institutionId, this.institutionForm.value).subscribe({
      next: () => {
        this.snackBar.open('Institution updated successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/institutions']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating institution', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/institutions']);
  }
}