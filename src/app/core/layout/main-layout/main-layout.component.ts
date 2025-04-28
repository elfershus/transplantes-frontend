// src/app/core/layout/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidenavOpened = true;
  
  navigationItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Doctors', icon: 'person', route: '/doctors' },
    { label: 'Institutions', icon: 'business', route: '/institutions' },
    { label: 'Donors', icon: 'volunteer_activism', route: '/donors' },
    { label: 'Receivers', icon: 'accessibility', route: '/receivers' },
    { label: 'Organs', icon: 'favorite', route: '/organs' },
    { label: 'Compatibility', icon: 'compare_arrows', route: '/compatibility' },
    { label: 'Transportation', icon: 'local_shipping', route: '/transportation' },
    { label: 'Reports', icon: 'assessment', route: '/reports' }
  ];
  
  constructor(public authService: AuthService) {}
  
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
  
  logout(): void {
    this.authService.logout();
  }
}