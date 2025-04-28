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
import { MatDividerModule } from '@angular/material/divider';
import { Compatibility } from '../../../core/models/compatibility.model';
import { CompatibilityService } from '../services/compatibility.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-compatibility-detail',
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
    MatDividerModule,
    ConfirmDialogComponent
  ],
  templateUrl: './compatibility-detail.component.html',
  styleUrls: ['./compatibility-detail.component.scss']
})
export class CompatibilityDetailComponent implements OnInit {
  compatibility: Compatibility | null = null;
  isLoading = true;
  error = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compatibilityService: CompatibilityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompatibilityRecord(+id);
    } else {
      this.router.navigate(['/compatibility']);
    }
  }
  
  loadCompatibilityRecord(id: number): void {
    this.isLoading = true;
    this.error = false;
    
    this.compatibilityService.getCompatibilityRecord(id).subscribe({
      next: (compatibility) => {
        this.compatibility = compatibility;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.error = true;
        this.snackBar.open('Error loading compatibility record', 'Close', { duration: 5000 });
      }
    });
  }
  
  deleteCompatibilityRecord(): void {
    if (!this.compatibility) return;
    
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
      if (result && this.compatibility?.id) {
        this.compatibilityService.deleteCompatibilityRecord(this.compatibility.id).subscribe({
          next: () => {
            this.snackBar.open('Compatibility record deleted successfully', 'Close', { duration: 5000 });
            this.router.navigate(['/compatibility']);
          },
          error: () => {
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
  
  getUrgencyClass(urgencyStatus: number): string {
    switch (urgencyStatus) {
      case 1: return 'urgency-critical';
      case 2: return 'urgency-urgent';
      default: return '';
    }
  }
  
  proceedToTransplant(): void {
    if (!this.compatibility || this.compatibility.status !== 'confirmed') return;
    
    // In a real application, navigate to transplant procedure creation with pre-filled data
    this.router.navigate(['/transplant-procedures/new'], { 
      queryParams: { compatibilityId: this.compatibility.id } 
    });
  }
}