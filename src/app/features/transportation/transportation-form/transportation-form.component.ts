import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Transportation } from '../../../core/models/transportation.model';
import { TransportationService } from '../services/transportation.service';

interface ApiDropdownOption {
  id: number;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-transportation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './transportation-form.component.html',
  styleUrls: ['./transportation-form.component.scss'],
})
export class TransportationFormComponent implements OnInit {
  transportationForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  editMode = false;
  id: number | null = null;

  transportMethods = ['ground', 'air', 'helicopter', 'ambulance'];
  statuses = ['scheduled', 'in-transit', 'delivered', 'delayed', 'cancelled'];

  // Placeholder data until we integrate with the real API
  organs: ApiDropdownOption[] = [];
  institutions: ApiDropdownOption[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transportationService: TransportationService,
    private snackBar: MatSnackBar
  ) {
    this.transportationForm = this.fb.group({
      organId: [null, Validators.required],
      originInstitutionId: [null, Validators.required],
      destinationInstitutionId: [null, Validators.required],
      departureTime: [null, Validators.required],
      estimatedArrivalTime: [null, Validators.required],
      actualArrivalTime: [null],
      transportMethod: ['ground', Validators.required],
      transportCompany: [''],
      trackingNumber: [''],
      status: ['scheduled', Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch related data (organs, institutions)
    this.fetchRelatedData();

    // Check if we're in edit mode
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.editMode = true;
        this.loadTransportation();
      }
    });
  }

  fetchRelatedData(): void {
    // In a real application, these would be actual API calls
    // For now, using placeholder data
    this.organs = [
      { id: 1, name: 'Heart (O+)', type: 'Heart', donor: { bloodType: 'O+' } },
      {
        id: 2,
        name: 'Kidney (A-)',
        type: 'Kidney',
        donor: { bloodType: 'A-' },
      },
      { id: 3, name: 'Liver (B+)', type: 'Liver', donor: { bloodType: 'B+' } },
    ];

    this.institutions = [
      { id: 1, name: 'Memorial Hospital' },
      { id: 2, name: 'University Medical Center' },
      { id: 3, name: 'Regional Transplant Center' },
    ];
  }

  loadTransportation(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.transportationService.getTransportation(this.id).subscribe({
      next: (data) => {
        this.patchFormWithData(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading transportation data', 'Close', {
          duration: 5000,
        });
        this.isLoading = false;
      },
    });
  }

  patchFormWithData(data: Transportation): void {
    this.transportationForm.patchValue({
      organId: data.organId,
      originInstitutionId: data.originInstitutionId,
      destinationInstitutionId: data.destinationInstitutionId,
      departureTime: data.departureTime ? new Date(data.departureTime) : null,
      estimatedArrivalTime: data.estimatedArrivalTime
        ? new Date(data.estimatedArrivalTime)
        : null,
      actualArrivalTime: data.actualArrivalTime
        ? new Date(data.actualArrivalTime)
        : null,
      transportMethod: data.transportMethod,
      transportCompany: data.transportCompany,
      trackingNumber: data.trackingNumber,
      status: data.status,
    });
  }

  onSubmit(): void {
    if (this.transportationForm.invalid) {
      this.transportationForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 5000,
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    if (this.editMode && this.id) {
      this.transportationService
        .updateTransportation(this.id, formData)
        .subscribe({
          next: (response) => {
            this.snackBar.open('Transportation updated successfully', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/transportation', this.id]);
            this.isSubmitting = false;
          },
          error: (error) => {
            this.snackBar.open('Error updating transportation', 'Close', {
              duration: 5000,
            });
            this.isSubmitting = false;
          },
        });
    } else {
      this.transportationService.createTransportation(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Transportation created successfully', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/transportation', response.id]);
          this.isSubmitting = false;
        },
        error: (error) => {
          this.snackBar.open('Error creating transportation', 'Close', {
            duration: 5000,
          });
          this.isSubmitting = false;
        },
      });
    }
  }

  prepareFormData(): Transportation {
    const formValue = this.transportationForm.value;

    // Format dates to ISO strings
    return {
      ...formValue,
      departureTime: formValue.departureTime
        ? new Date(formValue.departureTime).toISOString()
        : '',
      estimatedArrivalTime: formValue.estimatedArrivalTime
        ? new Date(formValue.estimatedArrivalTime).toISOString()
        : '',
      actualArrivalTime: formValue.actualArrivalTime
        ? new Date(formValue.actualArrivalTime).toISOString()
        : undefined,
    };
  }

  getFormControlError(controlName: string): string {
    const control = this.transportationForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'This field is required';
      }
    }
    return '';
  }

  compareOptions(option1: any, option2: any): boolean {
    return option1 === option2 || (option1 && option2 && option1 === option2);
  }
}
