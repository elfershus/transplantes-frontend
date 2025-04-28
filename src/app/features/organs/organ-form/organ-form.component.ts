// src/app/features/organs/organ-form/organ-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DonorsService } from '../../donors/services/donors.service';
import { OrgansService } from '../services/organs.service';
import { Donor } from '../../../core/models/donor.model';
import { Organ } from '../../../core/models/organ.model';

@Component({
  selector: 'app-organ-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './organ-form.component.html',
  styleUrls: ['./organ-form.component.scss']
})
export class OrganFormComponent implements OnInit {
  organForm: FormGroup;
  isEditing = false;
  organId: number | null = null;
  isLoading = false;
  isSaving = false;
  donors: Donor[] = [];
  
  organTypes = ['heart', 'liver', 'kidney', 'lung', 'pancreas', 'intestine'];
  conditions = ['excellent', 'good', 'fair', 'poor'];
  statuses = ['available', 'matched', 'in-transit', 'transplanted', 'expired'];
  
  constructor(
    private fb: FormBuilder,
    private organsService: OrgansService,
    private donorsService: DonorsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.organForm = this.fb.group({
      donorId: [null, [Validators.required]],
      type: ['', [Validators.required]],
      retrievalDate: [new Date(), [Validators.required]],
      expirationDate: [null, [Validators.required]],
      condition: ['good', [Validators.required]],
      status: ['available', [Validators.required]],
      storageLocation: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadDonors();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.organId = +id;
      this.loadOrgan(this.organId);
    }
  }
  
  loadDonors(): void {
    this.donorsService.getActiveDonors().subscribe({
      next: (donors) => {
        this.donors = donors;
      },
      error: () => {
        this.snackBar.open('Error loading donors', 'Close', { duration: 5000 });
      }
    });
  }
  
  loadOrgan(id: number): void {
    this.isLoading = true;
    
    this.organsService.getOrgan(id).subscribe({
      next: (organ) => {
        this.organForm.patchValue({
          donorId: organ.donor?.id,
          type: organ.type,
          retrievalDate: new Date(organ.retrievalDate),
          expirationDate: new Date(organ.expirationDate),
          condition: organ.condition,
          status: organ.status,
          storageLocation: organ.storageLocation
        });
        
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading organ', 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/organs']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.organForm.invalid) {
      this.markFormGroupTouched(this.organForm);
      return;
    }
    
    this.isSaving = true;
    
    if (this.isEditing && this.organId) {
      this.updateOrgan();
    } else {
      this.createOrgan();
    }
  }
  
  createOrgan(): void {
    this.organsService.createOrgan(this.organForm.value).subscribe({
      next: () => {
        this.snackBar.open('Organ created successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/organs']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating organ', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  updateOrgan(): void {
    if (!this.organId) return;
    
    this.organsService.updateOrgan(this.organId, this.organForm.value).subscribe({
      next: () => {
        this.snackBar.open('Organ updated successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/organs']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating organ', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/organs']);
  }
  
  // When retrieval date changes, update expiration date based on organ type
  onRetrievalDateChange(): void {
    const retrievalDate = this.organForm.get('retrievalDate')?.value;
    const organType = this.organForm.get('type')?.value;
    
    if (retrievalDate && organType) {
      const expirationDate = new Date(retrievalDate);
      
      // Set expiration date based on organ type (hours)
      switch (organType) {
        case 'heart':
          expirationDate.setHours(expirationDate.getHours() + 6);
          break;
        case 'lung':
          expirationDate.setHours(expirationDate.getHours() + 6);
          break;
        case 'liver':
          expirationDate.setHours(expirationDate.getHours() + 12);
          break;
        case 'pancreas':
          expirationDate.setHours(expirationDate.getHours() + 12);
          break;
        case 'kidney':
          expirationDate.setHours(expirationDate.getHours() + 48);
          break;
        case 'intestine':
          expirationDate.setHours(expirationDate.getHours() + 8);
          break;
        default:
          expirationDate.setHours(expirationDate.getHours() + 24);
      }
      
      this.organForm.get('expirationDate')?.setValue(expirationDate);
    }
  }
  
  // Helper method to mark all controls as touched to trigger validation
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  getDonorName(donor: Donor): string {
    return `${donor.firstName} ${donor.lastName} (${donor.bloodType})`;
  }
}