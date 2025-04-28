// 
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
import { MatSliderModule } from '@angular/material/slider';
import { CompatibilityService } from '../services/compatibility.service';
import { OrgansService } from '../../organs/services/organs.service';
import { ReceiversService } from '../../receivers/services/receivers.service';
import { Organ } from '../../../core/models/organ.model';
import { Receiver } from '../../../core/models/receiver.model';

@Component({
  selector: 'app-compatibility-form',
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
    MatSliderModule
  ],
  templateUrl: './compatibility-form.component.html',
  styleUrls: ['./compatibility-form.component.scss']
})
export class CompatibilityFormComponent implements OnInit {
  compatibilityForm: FormGroup;
  isEditing = false;
  compatibilityId: number | null = null;
  isLoading = false;
  isSaving = false;
  availableOrgans: Organ[] = [];
  waitingReceivers: Receiver[] = [];
  statuses = ['potential', 'confirmed', 'rejected', 'completed'];
  
  constructor(
    private fb: FormBuilder,
    private compatibilityService: CompatibilityService,
    private organsService: OrgansService,
    private receiversService: ReceiversService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.compatibilityForm = this.fb.group({
      organId: [null, [Validators.required]],
      receiverId: [null, [Validators.required]],
      compatibilityScore: [75, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
      status: ['potential', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.loadAvailableOrgans();
    this.loadWaitingReceivers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.compatibilityId = +id;
      this.loadCompatibilityRecord(this.compatibilityId);
    }
  }
  
  loadAvailableOrgans(): void {
    this.organsService.getAvailableOrgans().subscribe({
      next: (organs) => {
        this.availableOrgans = organs;
      },
      error: () => {
        this.snackBar.open('Error loading available organs', 'Close', { duration: 5000 });
      }
    });
  }
  
  loadWaitingReceivers(): void {
    this.receiversService.getWaitingReceivers().subscribe({
      next: (receivers) => {
        this.waitingReceivers = receivers;
      },
      error: () => {
        this.snackBar.open('Error loading waiting receivers', 'Close', { duration: 5000 });
      }
    });
  }
  
  loadCompatibilityRecord(id: number): void {
    this.isLoading = true;
    
    this.compatibilityService.getCompatibilityRecord(id).subscribe({
      next: (compatibility) => {
        this.compatibilityForm.patchValue({
          organId: compatibility.organ?.id,
          receiverId: compatibility.receiver?.id,
          compatibilityScore: compatibility.compatibilityScore,
          notes: compatibility.notes,
          status: compatibility.status
        });
        
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading compatibility record', 'Close', { duration: 5000 });
        this.isLoading = false;
        this.router.navigate(['/compatibility']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.compatibilityForm.invalid) {
      this.markFormGroupTouched(this.compatibilityForm);
      return;
    }
    
    this.isSaving = true;
    
    if (this.isEditing && this.compatibilityId) {
      this.updateCompatibilityRecord();
    } else {
      this.createCompatibilityRecord();
    }
  }
  
  createCompatibilityRecord(): void {
    this.compatibilityService.createCompatibilityRecord(this.compatibilityForm.value).subscribe({
      next: () => {
        this.snackBar.open('Compatibility record created successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/compatibility']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating compatibility record', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  updateCompatibilityRecord(): void {
    if (!this.compatibilityId) return;
    
    this.compatibilityService.updateCompatibilityRecord(this.compatibilityId, this.compatibilityForm.value).subscribe({
      next: () => {
        this.snackBar.open('Compatibility record updated successfully', 'Close', { duration: 5000 });
        this.router.navigate(['/compatibility']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating compatibility record', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/compatibility']);
  }
  
  generateCompatibilityScore(): void {
    // In a real application, this might call a backend service to calculate compatibility
    // For demo purposes, we'll just generate a random score between 50 and 100
    const randomScore = Math.floor(Math.random() * 51) + 50;
    this.compatibilityForm.get('compatibilityScore')?.setValue(randomScore);
  }
  
  getScoreColor(score: number): string {
    if (score >= 80) return 'primary';
    if (score >= 60) return 'accent';
    return 'warn';
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
  
  getOrganName(organ: Organ): string {
    if (!organ.donor) return `${organ.type}`;
    return `${organ.type} (${organ.donor.bloodType})`;
  }
  
  getReceiverName(receiver: Receiver): string {
    return `${receiver.firstName} ${receiver.lastName} (${receiver.bloodType})`;
  }
  
  getReceiverUrgencyClass(receiver: Receiver): string {
    switch (receiver.urgencyStatus) {
      case 1: return 'urgency-critical';
      case 2: return 'urgency-urgent';
      default: return '';
    }
  }
}