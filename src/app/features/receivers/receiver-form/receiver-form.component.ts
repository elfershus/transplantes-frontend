// src/app/features/receivers/receiver-form/receiver-form.component.ts
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
import { MatExpansionModule } from '@angular/material/expansion';
import { Receiver } from '../../../core/models/receiver.model';
import { ReceiversService } from '../services/receivers.service';

@Component({
  selector: 'app-receiver-form',
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
    MatSnackBarModule,
    MatExpansionModule
  ],
  templateUrl: './receiver-form.component.html',
  styleUrls: ['./receiver-form.component.scss']
})
export class ReceiverFormComponent implements OnInit {
  receiverForm: FormGroup;
  clinicHistoryForm: FormGroup;
  isEditing = false;
  receiverId: number | null = null;
  isLoading = false;
  isSaving = false;
  
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['Male', 'Female', 'Other'];
  statuses = ['waiting', 'matched', 'transplanted', 'inactive', 'deceased'];
  urgencyLevels = [1, 2, 3, 4, 5];
  
  constructor(
    private fb: FormBuilder,
    private receiversService: ReceiversService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.receiverForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      bloodType: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      hlaType: [''],
      urgencyStatus: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      registrationDate: [new Date(), [Validators.required]],
      status: ['waiting', [Validators.required]]
    });
    
    this.clinicHistoryForm = this.fb.group({
      medicalHistory: [''],
      allergies: [''],
      currentMedications: [''],
      previousSurgeries: [''],
      laboratoryResults: [{}],
      imagingResults: [{}]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.receiverId = +id;
      this.loadReceiver(this.receiverId);
    }
  }
  
  loadReceiver(id: number): void {
    this.isLoading = true;
    
    this.receiversService.getReceiver(id).subscribe({
      next: (receiver) => {
        // Update main form
        this.receiverForm.patchValue({
          firstName: receiver.firstName,
          lastName: receiver.lastName,
          dateOfBirth: new Date(receiver.dateOfBirth),
          bloodType: receiver.bloodType,
          gender: receiver.gender,
          hlaType: receiver.hlaType,
          urgencyStatus: receiver.urgencyStatus,
          registrationDate: new Date(receiver.registrationDate),
          status: receiver.status
        });
        
        // Update clinic history form if available
        if (receiver.clinicHistory) {
          this.clinicHistoryForm.patchValue({
            medicalHistory: receiver.clinicHistory.medicalHistory,
            allergies: receiver.clinicHistory.allergies,
            currentMedications: receiver.clinicHistory.currentMedications,
            previousSurgeries: receiver.clinicHistory.previousSurgeries,
            laboratoryResults: receiver.clinicHistory.laboratoryResults || {},
            imagingResults: receiver.clinicHistory.imagingResults || {}
          });
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading receiver', 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/receivers']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.receiverForm.invalid) {
      this.markFormGroupTouched(this.receiverForm);
      return;
    }
    
    this.isSaving = true;
    
    // Combine the forms
    const receiverData = {
      ...this.receiverForm.value,
      clinicHistory: this.clinicHistoryForm.value
    };
    
    if (this.isEditing && this.receiverId) {
      this.updateReceiver(receiverData);
    } else {
      this.createReceiver(receiverData);
    }
  }
  
  createReceiver(receiverData: Receiver): void {
    this.receiversService.createReceiver(receiverData).subscribe({
      next: () => {
        this.snackBar.open('Receiver created successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/receivers']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating receiver', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  updateReceiver(receiverData: Receiver): void {
    if (!this.receiverId) return;
    
    this.receiversService.updateReceiver(this.receiverId, receiverData).subscribe({
      next: () => {
        this.snackBar.open('Receiver updated successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/receivers']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating receiver', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/receivers']);
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
}