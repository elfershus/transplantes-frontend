// src/app/features/donors/donors-list/donors-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Donor } from '../../../core/models/donor.model';
import { DonorsService } from '../services/donors.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-donors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './donors-list.component.html',
  styleUrls: ['./donors-list.component.scss']
})
export class DonorsListComponent implements OnInit {
  donors: Donor[] = [];
  displayedColumns: string[] = ['name', 'bloodType', 'gender', 'consentStatus', 'status', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  statuses = ['active', 'inactive', 'deceased', 'disqualified'];
  
  constructor(
    private donorsService: DonorsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      bloodType: [''],
      status: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadDonors();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadDonors();
    });
  }
  
  loadDonors(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'lastName:ASC',
      withClinicHistory: 'true'
    };
    
    this.donorsService.getDonors(params).subscribe({
      next: (response) => {
        this.donors = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading donors', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDonors();
  }
  
  deleteDonor(donor: Donor): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete donor ${donor.firstName} ${donor.lastName}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && donor.id) {
        this.donorsService.deleteDonor(donor.id).subscribe({
          next: () => {
            this.snackBar.open('Donor deleted successfully', 'Close', { duration: 5000 });
            this.loadDonors();
          },
          error: (error) => {
            this.snackBar.open('Error deleting donor', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'deceased': return 'accent';
      default: return '';
    }
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadDonors();
  }
}