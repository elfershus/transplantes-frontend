// src/app/features/doctors/doctors-list/doctors-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorsService } from '../services/doctors.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    ConfirmDialogComponent
  ],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'specialty', 'email', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  constructor(
    private doctorsService: DoctorsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      specialty: [''],
      email: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadDoctors();
    
    // React to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadDoctors();
    });
  }
  
  loadDoctors(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'lastName:ASC'
    };
    
    this.doctorsService.getDoctors(params).subscribe({
      next: (response) => {
        this.doctors = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading doctors', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDoctors();
  }
  
  deleteDoctor(doctor: Doctor): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete Doctor ${doctor.firstName} ${doctor.lastName}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && doctor.id) {
        this.doctorsService.deleteDoctor(doctor.id).subscribe({
          next: () => {
            this.snackBar.open('Doctor deleted successfully', 'Close', { duration: 5000 });
            this.loadDoctors();
          },
          error: (error) => {
            this.snackBar.open('Error deleting doctor', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadDoctors();
  }
}