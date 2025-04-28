// src/app/features/receivers/receivers-list/receivers-list.component.ts
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
import { Receiver } from '../../../core/models/receiver.model';
import { ReceiversService } from '../services/receivers.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-receivers-list',
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
  templateUrl: './receivers-list.component.html',
  styleUrls: ['./receivers-list.component.scss']
})
export class ReceiversListComponent implements OnInit {
  receivers: Receiver[] = [];
  displayedColumns: string[] = ['name', 'bloodType', 'urgencyStatus', 'registrationDate', 'status', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  statuses = ['waiting', 'matched', 'transplanted', 'inactive', 'deceased'];
  urgencyLevels = [
    { value: 1, label: '1 - Critical' },
    { value: 2, label: '2 - Urgent' },
    { value: 3, label: '3 - Standard' },
    { value: 4, label: '4 - Stable' },
    { value: 5, label: '5 - Low Priority' }
  ];
  
  constructor(
    private receiversService: ReceiversService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      bloodType: [''],
      urgencyStatus: [''],
      status: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadReceivers();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadReceivers();
    });
  }
  
  loadReceivers(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'urgencyStatus:ASC,lastName:ASC',
      withClinicHistory: 'true'
    };
    
    this.receiversService.getReceivers(params).subscribe({
      next: (response) => {
        this.receivers = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading receivers', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadReceivers();
  }
  
  deleteReceiver(receiver: Receiver): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete receiver ${receiver.firstName} ${receiver.lastName}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && receiver.id) {
        this.receiversService.deleteReceiver(receiver.id).subscribe({
          next: () => {
            this.snackBar.open('Receiver deleted successfully', 'Close', { duration: 5000 });
            this.loadReceivers();
          },
          error: (error) => {
            this.snackBar.open('Error deleting receiver', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getUrgencyColor(urgencyStatus: number): string {
    switch (urgencyStatus) {
      case 1: return 'accent'; // Critical
      case 2: return 'warn';   // Urgent
      case 3: return 'primary'; // Standard
      default: return '';
    }
  }
  
  getUrgencyLabel(urgencyStatus: number): string {
    const level = this.urgencyLevels.find(l => l.value === urgencyStatus);
    return level ? level.label : `${urgencyStatus}`;
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting': return 'primary';
      case 'matched': return 'accent';
      case 'transplanted': return 'primary';
      case 'inactive': return '';
      case 'deceased': return 'warn';
      default: return '';
    }
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadReceivers();
  }
}