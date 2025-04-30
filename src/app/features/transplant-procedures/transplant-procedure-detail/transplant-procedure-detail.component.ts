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

import { TransplantProcedure } from '../../../core/models/transplant-procedure.model';
import { TransplantProceduresService } from '../services/transplant-procedures.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transplant-procedure-detail',
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
  templateUrl: './transplant-procedure-detail.component.html',
  styleUrls: ['./transplant-procedure-detail.component.scss'],
})
export class TransplantProcedureDetailComponent implements OnInit {
  procedure: TransplantProcedure | null = null;
  isLoading = true;
  error = false;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transplantProceduresService: TransplantProceduresService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.loadProcedure();
      } else {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  loadProcedure(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.transplantProceduresService.getTransplantProcedure(this.id).subscribe({
      next: (data) => {
        this.procedure = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = true;
        this.isLoading = false;
        this.snackBar.open(
          'Error loading transplant procedure details',
          'Close',
          { duration: 5000 }
        );
      },
    });
  }

  deleteProcedure(): void {
    if (!this.procedure || !this.procedure.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this transplant procedure record?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.procedure?.id) {
        this.transplantProceduresService
          .deleteProcedure(this.procedure.id)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Transplant procedure deleted successfully',
                'Close',
                { duration: 5000 }
              );
              this.router.navigate(['/transplant-procedures']);
            },
            error: (error: any) => {
              this.snackBar.open(
                'Error deleting transplant procedure',
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
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'warn';
      default:
        return '';
    }
  }

  getOutcomeColor(outcome: string | undefined | null): string {
    if (!outcome) return '';

    switch (outcome) {
      case 'successful':
        return 'accent';
      case 'complications':
        return 'warn';
      case 'failed':
        return 'warn';
      default:
        return '';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleString();
  }

  formatDuration(minutes: number | undefined): string {
    if (!minutes) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }

    return `${remainingMinutes}m`;
  }
}
