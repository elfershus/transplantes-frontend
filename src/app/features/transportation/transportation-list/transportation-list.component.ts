// src/app/features/transportation/transportation-list/transportation-list.component.ts
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
import { Transportation } from '../../../core/models/transportation.model';
import { TransportationService } from '../services/transportation.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transportation-list',
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
  templateUrl: './transportation-list.component.html',
  styleUrls: ['./transportation-list.component.scss']
})
export class TransportationListComponent implements OnInit {
  transportations: Transportation[] = [];
  displayedColumns: string[] = ['organ', 'origin', 'destination', 'departure', 'arrival', 'method', 'status', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  transportMethods = ['ground', 'air', 'helicopter', 'ambulance'];
  statuses = ['scheduled', 'in-transit', 'delivered', 'delayed', 'cancelled'];
  
  constructor(
    private transportationService: TransportationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      organId: [''],
      status: [''],
      transportMethod: [''],
      originInstitutionId: [''],
      destinationInstitutionId: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadTransportations();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadTransportations();
    });
  }
  
  loadTransportations(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'departureTime:DESC',
      includeRelations: 'true'
    };
    
    this.transportationService.getTransportations(params).subscribe({
      next: (response) => {
        this.transportations = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading transportations', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadTransportations();
  }
  
  deleteTransportation(transportation: Transportation): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this transportation record?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && transportation.id) {
        this.transportationService.deleteTransportation(transportation.id).subscribe({
          next: () => {
            this.snackBar.open('Transportation record deleted successfully', 'Close', { duration: 5000 });
            this.loadTransportations();
          },
          error: (error) => {
            this.snackBar.open('Error deleting transportation record', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return '';
      case 'in-transit': return 'primary';
      case 'delivered': return 'primary';
      case 'delayed': return 'warn';
      case 'cancelled': return '';
      default: return '';
    }
  }
  
  getTransportMethodIcon(method: string): string {
    switch (method) {
      case 'ground': return 'local_shipping';
      case 'air': return 'flight';
      case 'helicopter': return 'helicopter';
      case 'ambulance': return 'emergency';
      default: return 'local_shipping';
    }
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadTransportations();
  }
  
  getOrganName(transportation: Transportation): string {
    if (!transportation.organ) return 'Unknown';
    return `${transportation.organ.type} (${transportation.organ.donor?.bloodType || 'Unknown'})`;
  }
  
  getInstitutionName(institution: any): string {
    if (!institution) return 'Unknown';
    return institution.name;
  }
  
  isOverdue(transportation: Transportation): boolean {
    if (transportation.status !== 'in-transit' || !transportation.estimatedArrivalTime) return false;
    
    const now = new Date();
    const eta = new Date(transportation.estimatedArrivalTime);
    return now > eta;
  }
}