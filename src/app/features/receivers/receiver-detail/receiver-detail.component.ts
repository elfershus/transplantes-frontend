// src/app/features/receivers/receiver-detail/receiver-detail.component.ts
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
import { MatTableModule } from '@angular/material/table';
import { Receiver } from '../../../core/models/receiver.model';
import { ReceiversService } from '../services/receivers.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-receiver-detail',
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
    MatTableModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './receiver-detail.component.html',
  styleUrls: ['./receiver-detail.component.scss'],
})
export class ReceiverDetailComponent implements OnInit {
  receiver: Receiver | null = null;
  isLoading = true;
  error = false;

  // Potential matches display columns
  matchesColumns: string[] = ['organ', 'score', 'status', 'date'];

  // Urgency levels map for display
  urgencyLevels: { [key: number]: string } = {
    1: 'Critical',
    2: 'Urgent',
    3: 'Standard',
    4: 'Stable',
    5: 'Low Priority',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiversService: ReceiversService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReceiver(+id);
    } else {
      this.router.navigate(['/receivers']);
    }
  }

  loadReceiver(id: number): void {
    this.isLoading = true;
    this.error = false;

    this.receiversService.getReceiver(id).subscribe({
      next: (receiver) => {
        this.receiver = receiver;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.error = true;
        this.snackBar.open('Error loading receiver details', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  deleteReceiver(): void {
    if (!this.receiver) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${this.receiver.firstName} ${this.receiver.lastName}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.receiver?.id) {
        this.receiversService.deleteReceiver(this.receiver.id).subscribe({
          next: () => {
            this.snackBar.open('Receiver deleted successfully', 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/receivers']);
          },
          error: () => {
            this.snackBar.open('Error deleting receiver', 'Close', {
              duration: 5000,
            });
          },
        });
      }
    });
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getUrgencyColor(urgencyStatus: number | undefined): string {
    if (urgencyStatus === undefined) return '';

    switch (urgencyStatus) {
      case 1:
        return 'accent'; // Critical
      case 2:
        return 'warn'; // Urgent
      case 3:
        return 'primary'; // Standard
      default:
        return '';
    }
  }

  getUrgencyText(urgencyStatus: number | undefined): string {
    if (urgencyStatus === undefined) return 'Unknown';

    return this.urgencyLevels[urgencyStatus] || 'Unknown';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting':
        return 'primary';
      case 'matched':
        return 'accent';
      case 'transplanted':
        return 'primary';
      case 'inactive':
        return '';
      case 'deceased':
        return 'warn';
      default:
        return '';
    }
  }

  getCompatibilityScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }
}
