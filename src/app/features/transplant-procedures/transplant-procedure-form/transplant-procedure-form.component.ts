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

import { TransplantProcedure } from '../../../core/models/transplant-procedure.model';
import { TransplantProceduresService } from '../services/transplant-procedures.service';

interface ApiDropdownOption {
  id: number;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-transplant-procedure-form',
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
  templateUrl: './transplant-procedure-form.component.html',
  styleUrls: ['./transplant-procedure-form.component.scss'],
})
export class TransplantProcedureFormComponent implements OnInit {
  procedureForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  editMode = false;
  id: number | null = null;

  statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
  outcomes = ['successful', 'complications', 'failed'];

  // Placeholder data until we integrate with the real API
  doctors: ApiDropdownOption[] = [];
  institutions: ApiDropdownOption[] = [];
  compatibilities: ApiDropdownOption[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transplantProceduresService: TransplantProceduresService,
    private snackBar: MatSnackBar
  ) {
    this.procedureForm = this.fb.group({
      compatibilityId: [null, Validators.required],
      leadDoctorId: [null, Validators.required],
      institutionId: [null, Validators.required],
      scheduledDate: [null, Validators.required],
      actualDate: [null],
      durationMinutes: [null],
      status: ['scheduled', Validators.required],
      outcome: [null],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // Fetch related data
    this.fetchRelatedData();

    // Check if we're in edit mode
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.editMode = true;
        this.loadProcedure();
      }
    });

    // Add validation based on status
    this.procedureForm.get('status')?.valueChanges.subscribe((status) => {
      const outcomeControl = this.procedureForm.get('outcome');
      const actualDateControl = this.procedureForm.get('actualDate');
      const durationControl = this.procedureForm.get('durationMinutes');

      if (status === 'completed') {
        outcomeControl?.setValidators(Validators.required);
        actualDateControl?.setValidators(Validators.required);
        durationControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
      } else {
        outcomeControl?.clearValidators();
        actualDateControl?.clearValidators();
        durationControl?.clearValidators();
      }

      outcomeControl?.updateValueAndValidity();
      actualDateControl?.updateValueAndValidity();
      durationControl?.updateValueAndValidity();
    });
  }

  fetchRelatedData(): void {
    // In a real application, these would be actual API calls
    // For now, using placeholder data
    this.doctors = [
      { id: 1, name: 'Dr. John Smith', specialty: 'Cardiology' },
      { id: 2, name: 'Dr. Maria Johnson', specialty: 'Nephrology' },
      { id: 3, name: 'Dr. Robert Lee', specialty: 'Transplant Surgery' },
    ];

    this.institutions = [
      { id: 1, name: 'Memorial Hospital' },
      { id: 2, name: 'University Medical Center' },
      { id: 3, name: 'Regional Transplant Center' },
    ];

    this.compatibilities = [
      {
        id: 1,
        name: 'Kidney Match - Patient A (98% compatibility)',
        matchScore: 98,
      },
      {
        id: 2,
        name: 'Liver Match - Patient B (87% compatibility)',
        matchScore: 87,
      },
      {
        id: 3,
        name: 'Heart Match - Patient C (95% compatibility)',
        matchScore: 95,
      },
    ];
  }

  loadProcedure(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.transplantProceduresService.getTransplantProcedure(this.id).subscribe({
      next: (data) => {
        this.patchFormWithData(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading transplant procedure data', 'Close', {
          duration: 5000,
        });
        this.isLoading = false;
      },
    });
  }

  patchFormWithData(data: TransplantProcedure): void {
    this.procedureForm.patchValue({
      compatibilityId: data.compatibilityId,
      leadDoctorId: data.leadDoctorId,
      institutionId: data.institutionId,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      actualDate: data.actualDate ? new Date(data.actualDate) : null,
      durationMinutes: data.durationMinutes,
      status: data.status,
      outcome: data.outcome,
      notes: data.notes,
    });
  }

  onSubmit(): void {
    if (this.procedureForm.invalid) {
      this.procedureForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 5000,
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    if (this.editMode && this.id) {
      this.transplantProceduresService
        .updateTransplantProcedure(this.id, formData)
        .subscribe({
          next: (response) => {
            this.snackBar.open(
              'Transplant procedure updated successfully',
              'Close',
              { duration: 5000 }
            );
            this.router.navigate(['/transplant-procedures', this.id]);
            this.isSubmitting = false;
          },
          error: (error) => {
            this.snackBar.open('Error updating transplant procedure', 'Close', {
              duration: 5000,
            });
            this.isSubmitting = false;
          },
        });
    } else {
      this.transplantProceduresService
        .createTransplantProcedure(formData)
        .subscribe({
          next: (response) => {
            this.snackBar.open(
              'Transplant procedure created successfully',
              'Close',
              { duration: 5000 }
            );
            this.router.navigate(['/transplant-procedures', response.id]);
            this.isSubmitting = false;
          },
          error: (error) => {
            this.snackBar.open('Error creating transplant procedure', 'Close', {
              duration: 5000,
            });
            this.isSubmitting = false;
          },
        });
    }
  }

  prepareFormData(): TransplantProcedure {
    const formValue = this.procedureForm.value;

    // Format dates to ISO strings
    return {
      ...formValue,
      scheduledDate: formValue.scheduledDate
        ? new Date(formValue.scheduledDate).toISOString()
        : '',
      actualDate: formValue.actualDate
        ? new Date(formValue.actualDate).toISOString()
        : undefined,
    };
  }

  getFormControlError(controlName: string): string {
    const control = this.procedureForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['min']) {
        return 'Value must be greater than 0';
      }
    }
    return '';
  }

  compareOptions(option1: any, option2: any): boolean {
    return option1 === option2 || (option1 && option2 && option1 === option2);
  }
}
