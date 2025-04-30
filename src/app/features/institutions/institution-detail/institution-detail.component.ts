import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-institution-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Institution Details</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Loading institution details...</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="goBack()">Back</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
})
export class InstitutionDetailComponent implements OnInit {
  institutionId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.institutionId = Number(this.route.snapshot.paramMap.get('id'));
  }

  goBack(): void {
    this.router.navigate(['/institutions']);
  }
}
