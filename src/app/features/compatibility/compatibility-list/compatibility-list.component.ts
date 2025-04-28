// src/app/features/compatibility/compatibility-list/compatibility-list.component.ts
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
import { MatBadgeModule } from '@angular/material/badge';
import { Compatibility } from '../../../core/models/compatibility.model';
import { CompatibilityService } from '../services/compatibility.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-compatibility-list',
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
    MatBadgeModule,
    ConfirmDialogComponent
  ],
  templateUrl: './compatibility-list.component.html',
  styleUrls: ['./compatibility-list.component.scss']
})
export class CompatibilityListComponent implements OnInit {
  compatibilityRecords: Compatibility[] = [];
  displayedColumns: string[] = ['organ', 'receiver', 'score', 'status', 'matchDate', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  statuses = ['potential', 'confirmed', 'rejected', 'completed'];
  
  constructor(
    private compatibilityService: CompatibilityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      organId: [''],
      receiverId: [''],
      status: [''],
      minScore: [''],
      maxScore: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadCompatibilityRecords();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadCompatibilityRecords();
    });
  }
  
  loadCompatibilityRecords(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'compatibilityScore:DESC',
      includeRelations: 'true'
    };
    
    this.compatibilityService.getCompatibilityRecords(params).subscribe({
      next: (response) => {
        this.compatibilityRecords = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading compatibility records', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCompatibilityRecords();
  }
  
  deleteCompatibilityRecord(compatibility: Compatibility): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this compatibility record?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && compatibility.id) {
        this.compatibilityService.deleteCompatibilityRecord(compatibility.id).subscribe({
          next: () => {
            this.snackBar.open('Compatibility record deleted successfully', 'Close', { duration: 5000 });
            this.loadCompatibilityRecords();
          },
          error: (error) => {
            this.snackBar.open('Error deleting compatibility record', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'potential': return '';
      case 'confirmed': return 'primary';
      case 'rejected': return 'warn';
      case 'completed': return 'accent';
      default: return '';
    }
  }
  
  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadCompatibilityRecords();
  }
  
  getOrganName(compatibility: Compatibility): string {
    if (!compatibility.organ) return 'Unknown';
    return `${compatibility.organ.type} (${compatibility.organ.donor?.bloodType || 'Unknown'})`;
  }
  
  getReceiverName(compatibility: Compatibility): string {
    if (!compatibility.receiver) return 'Unknown';
    return `${compatibility.receiver.firstName} ${compatibility.receiver.lastName} (${compatibility.receiver.bloodType})`;
  }
}