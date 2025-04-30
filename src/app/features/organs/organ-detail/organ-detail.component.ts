// src/app/features/organs/organ-detail/organ-detail.component.ts
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
import { MatDividerModule } from '@angular/material/divider';
import { Organ } from '../../../core/models/organ.model';
import { OrgansService } from '../services/organs.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-organ-detail',
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
    MatDividerModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './organ-detail.component.html',
  styleUrls: ['./organ-detail.component.scss'],
})
export class OrganDetailComponent implements OnInit {
  organ: Organ | null = null;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organsService: OrgansService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrgan(+id);
    } else {
      this.router.navigate(['/organs']);
    }
  }

  loadOrgan(id: number): void {
    this.isLoading = true;
    this.error = false;

    this.organsService.getOrgan(id).subscribe({
      next: (organ) => {
        this.organ = organ;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.error = true;
        this.snackBar.open('Error loading organ details', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  deleteOrgan(): void {
    if (!this.organ) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this ${this.organ.type} organ?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.organ?.id) {
        this.organsService.deleteOrgan(this.organ.id).subscribe({
          next: () => {
            this.snackBar.open('Organ deleted successfully', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/organs']);
          },
          error: () => {
            this.snackBar.open('Error deleting organ', 'Close', {
              duration: 5000,
            });
          },
        });
      }
    });
  }

  getConditionColor(condition: string | undefined): string {
    if (!condition) return '';

    switch (condition) {
      case 'excellent':
        return 'primary';
      case 'good':
        return 'primary';
      case 'fair':
        return 'accent';
      case 'poor':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return 'primary';
      case 'matched':
        return 'accent';
      case 'in-transit':
        return 'warn';
      case 'transplanted':
        return 'primary';
      case 'expired':
        return '';
      default:
        return '';
    }
  }

  getRemainingTime(expirationDate: Date): string {
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

  isExpiringSoon(expirationDate: Date): boolean {
    if (!expirationDate) return false;

    const expiration = new Date(expirationDate);
    const now = new Date();
    const diffMs = expiration.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 && diffHours <= 6;
  }

  getDonorName(organ: Organ): string {
    if (!organ.donor) return 'Unknown';
    return `${organ.donor.firstName} ${organ.donor.lastName}`;
  }

  getCompatibilityScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }
}
