// src/app/features/transportation/transportation-detail/transportation-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Transportation } from '../../../core/models/transportation.model';
import { TransportationService } from '../services/transportation.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transportation-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './transportation-detail.component.html',
  styleUrls: ['./transportation-detail.component.scss'],
})
export class TransportationDetailComponent implements OnInit {
  transportation: Transportation | null = null;
  isLoading = true;
  error = false;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transportationService: TransportationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.loadTransportation();
      } else {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  loadTransportation(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.transportationService.getTransportation(this.id).subscribe({
      next: (data) => {
        this.transportation = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = true;
        this.isLoading = false;
        this.snackBar.open('Error loading transportation details', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  deleteTransportation(): void {
    if (!this.transportation || !this.transportation.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this transportation record?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.transportation?.id) {
        this.transportationService
          .deleteTransportation(this.transportation.id)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Transportation record deleted successfully',
                'Close',
                { duration: 5000 }
              );
              this.router.navigate(['/transportation']);
            },
            error: (error) => {
              this.snackBar.open(
                'Error deleting transportation record',
                'Close',
                { duration: 5000 }
              );
            },
          });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return '';
      case 'in-transit':
        return 'primary';
      case 'delivered':
        return 'primary';
      case 'delayed':
        return 'warn';
      case 'cancelled':
        return '';
      default:
        return '';
    }
  }

  getTransportMethodIcon(method: string): string {
    switch (method) {
      case 'ground':
        return 'local_shipping';
      case 'air':
        return 'flight';
      case 'helicopter':
        return 'helicopter';
      case 'ambulance':
        return 'emergency';
      default:
        return 'local_shipping';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString();
  }

  isOverdue(transportation: Transportation): boolean {
    if (
      transportation.status !== 'in-transit' ||
      !transportation.estimatedArrivalTime
    )
      return false;

    const now = new Date();
    const eta = new Date(transportation.estimatedArrivalTime);
    return now > eta;
  }
}
