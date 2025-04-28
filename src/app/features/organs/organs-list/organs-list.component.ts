// src/app/features/organs/organs-list/organs-list.component.ts
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { Organ } from '../../../core/models/organ.model';
import { OrgansService } from '../services/organs.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-organs-list',
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
    MatTooltipModule,
    ConfirmDialogComponent
  ],
  templateUrl: './organs-list.component.html',
  styleUrls: ['./organs-list.component.scss']
})
export class OrgansListComponent implements OnInit {
  organs: Organ[] = [];
  displayedColumns: string[] = ['type', 'donor', 'retrievalDate', 'expirationDate', 'condition', 'status', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  organTypes = ['heart', 'liver', 'kidney', 'lung', 'pancreas', 'intestine'];
  conditions = ['excellent', 'good', 'fair', 'poor'];
  statuses = ['available', 'matched', 'in-transit', 'transplanted', 'expired'];
  
  constructor(
    private organsService: OrgansService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      type: [''],
      condition: [''],
      status: [''],
      donorId: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadOrgans();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadOrgans();
    });
  }
  
  loadOrgans(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'retrievalDate:DESC',
      withDonor: 'true'
    };
    
    this.organsService.getOrgans(params).subscribe({
      next: (response) => {
        this.organs = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading organs', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadOrgans();
  }
  
  deleteOrgan(organ: Organ): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this ${organ.type} organ?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && organ.id) {
        this.organsService.deleteOrgan(organ.id).subscribe({
          next: () => {
            this.snackBar.open('Organ deleted successfully', 'Close', { duration: 5000 });
            this.loadOrgans();
          },
          error: (error) => {
            this.snackBar.open('Error deleting organ', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getConditionColor(condition: string): string {
    switch (condition) {
      case 'excellent': return 'primary';
      case 'good': return 'primary';
      case 'fair': return 'accent';
      case 'poor': return 'warn';
      default: return '';
    }
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return 'primary';
      case 'matched': return 'accent';
      case 'in-transit': return 'warn';
      case 'transplanted': return 'primary';
      case 'expired': return '';
      default: return '';
    }
  }
  
  getRemainingTime(expirationDate: string): string {
    if (!expirationDate) return 'N/A';
    
    const expiration = new Date(expirationDate);
    const now = new Date();
    
    if (expiration <= now) {
      return 'Expired';
    }
    
    const diffMs = expiration.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days, ${diffHours % 24} hours`;
    }
    
    return `${diffHours} hours, ${diffMinutes} minutes`;
  }
  
  isExpiringSoon(expirationDate: string): boolean {
    if (!expirationDate) return false;
    
    const expiration = new Date(expirationDate);
    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > 0 && diffHours <= 6;
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadOrgans();
  }
  
  getDonorName(organ: Organ): string {
    if (!organ.donor) return 'Unknown';
    return `${organ.donor.firstName} ${organ.donor.lastName}`;
  }
}