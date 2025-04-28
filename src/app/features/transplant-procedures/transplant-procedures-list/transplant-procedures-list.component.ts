// 
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransplantProcedure } from '../../../core/models/transplant-procedure.model';
import { TransplantProceduresService } from '../services/transplant-procedures.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transplant-procedures-list',
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
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmDialogComponent
  ],
  templateUrl: './transplant-procedures-list.component.html',
  styleUrls: ['./transplant-procedures-list.component.scss']
})
export class TransplantProceduresListComponent implements OnInit {
  procedures: TransplantProcedure[] = [];
  displayedColumns: string[] = ['date', 'organ', 'receiver', 'doctor', 'institution', 'status', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
  outcomes = ['successful', 'failed', 'complications'];
  
  constructor(
    private proceduresService: TransplantProceduresService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      leadDoctorId: [''],
      institutionId: [''],
      status: [''],
      startDate: [null],
      endDate: [null]
    });
  }
  
  ngOnInit(): void {
    this.loadProcedures();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadProcedures();
    });
  }
  
  loadProcedures(): void {
    this.isLoading = true;
    
    const filterValue = { ...this.filterForm.value };
    if (filterValue.startDate) {
      filterValue.startDate = filterValue.startDate.toISOString();
    }
    if (filterValue.endDate) {
      filterValue.endDate = filterValue.endDate.toISOString();
    }
    
    const params = {
      ...filterValue,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'scheduledDate:DESC',
      includeRelations: 'true'
    };
    
    this.proceduresService.getProcedures(params).subscribe({
      next: (response) => {
        this.procedures = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading procedures', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadProcedures();
  }
  
  deleteProcedure(procedure: TransplantProcedure): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this transplant procedure?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && procedure.id) {
        this.proceduresService.deleteProcedure(procedure.id).subscribe({
          next: () => {
            this.snackBar.open('Procedure deleted successfully', 'Close', { duration: 5000 });
            this.loadProcedures();
          },
          error: (error) => {
            this.snackBar.open('Error deleting procedure', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return '';
      case 'in-progress': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadProcedures();
  }
  
  getOrganName(procedure: TransplantProcedure): string {
    if (!procedure.organ) return 'Unknown';
    return procedure.organ.type;
  }
  
  getReceiverName(procedure: TransplantProcedure): string {
    if (!procedure.receiver) return 'Unknown';
    return `${procedure.receiver.firstName} ${procedure.receiver.lastName}`;
  }
  
  getDoctorName(procedure: TransplantProcedure): string {
    if (!procedure.leadDoctor) return 'Unknown';
    return `Dr. ${procedure.leadDoctor.lastName}`;
  }
  
  getInstitutionName(procedure: TransplantProcedure): string {
    if (!procedure.institution) return 'Unknown';
    return procedure.institution.name;
  }
}