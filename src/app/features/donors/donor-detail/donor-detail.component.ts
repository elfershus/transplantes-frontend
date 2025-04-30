import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-donor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Donor Details</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Loading donor details...</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="goBack()">Back</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
})
export class DonorDetailComponent implements OnInit {
  donorId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.donorId = Number(this.route.snapshot.paramMap.get('id'));
  }

  goBack(): void {
    this.router.navigate(['/donors']);
  }
}
