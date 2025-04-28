// src/app/features/doctors/doctor-detail/doctor-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorsService } from '../services/doctors.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss']
})
export class DoctorDetailComponent implements OnInit {
  doctor: Doctor | null = null;
  isLoading = true;
  error = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorsService: DoctorsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctor(+id);
    } else {
      this.router.navigate(['/doctors']);
    }
  }
  
  loadDoctor(id: number): void {
    this.isLoading = true;
    this.error = false;
    
    this.doctorsService.getDoctor(id).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.error = true;
        this.snackBar.open('Error loading doctor details', 'Close', { duration: 5000 });
      }
    });
  }
  
  deleteDoctor(): void {
    if (!this.doctor) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${this.doctor.firstName} ${this.doctor.lastName}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.doctor?.id) {
        this.doctorsService.deleteDoctor(this.doctor.id).subscribe({
          next: () => {
            this.snackBar.open('Doctor deleted successfully', 'Close', { duration: 5000 });
            this.router.navigate(['/doctors']);
          },
          error: () => {
            this.snackBar.open('Error deleting doctor', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}