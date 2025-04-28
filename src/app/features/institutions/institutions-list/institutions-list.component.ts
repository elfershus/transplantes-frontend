// src/app/features/institutions/institutions-list/institutions-list.component.ts
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Institution } from '../../../core/models/institution.model';
import { InstitutionsService } from '../services/institutions.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-institutions-list',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    ConfirmDialogComponent
  ],
  templateUrl: './institutions-list.component.html',
  styleUrls: ['./institutions-list.component.scss']
})
export class InstitutionsListComponent implements OnInit {
  institutions: Institution[] = [];
  displayedColumns: string[] = ['name', 'address', 'licenseNumber', 'email', 'phone', 'actions'];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  filterForm: FormGroup;
  
  constructor(
    private institutionsService: InstitutionsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      address: [''],
      licenseNumber: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadInstitutions();
    
    this.filterForm.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.loadInstitutions();
    });
  }
  
  loadInstitutions(): void {
    this.isLoading = true;
    
    const params = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
      sort: 'name:ASC'
    };
    
    this.institutionsService.getInstitutions(params).subscribe({
      next: (response) => {
        this.institutions = response.items;
        this.totalItems = response.pagination.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading institutions', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadInstitutions();
  }
  
  deleteInstitution(institution: Institution): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${institution.name}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && institution.id) {
        this.institutionsService.deleteInstitution(institution.id).subscribe({
          next: () => {
            this.snackBar.open('Institution deleted successfully', 'Close', { duration: 5000 });
            this.loadInstitutions();
          },
          error: (error) => {
            this.snackBar.open('Error deleting institution', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
  
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadInstitutions();
  }
}