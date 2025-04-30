import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add Donor</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="donorForm" (ngSubmit)="onSubmit()">
          <p>Form under construction...</p>
          <div class="form-actions">
            <button mat-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit">Submit</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `]
})
export class DonorFormComponent {
  donorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.donorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.donorForm.invalid) {
      return;
    }
    // Implementation will be added later
    this.router.navigate(['/donors']);
  }

  cancel(): void {
    this.router.navigate(['/donors']);
  }
}
