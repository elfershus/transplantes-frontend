// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'doctors',
        loadChildren: () => import('./features/doctors/doctors.routes').then(m => m.DOCTORS_ROUTES)
      },
      { 
        path: 'institutions',
        loadChildren: () => import('./features/institutions/institutions.routes').then(m => m.INSTITUTIONS_ROUTES)
      },
      { 
        path: 'donors',
        loadChildren: () => import('./features/donors/donors.routes').then(m => m.DONORS_ROUTES)
      },
      { 
        path: 'receivers',
        loadChildren: () => import('./features/receivers/receivers.routes').then(m => m.RECEIVERS_ROUTES)
      },
      { 
        path: 'organs',
        loadChildren: () => import('./features/organs/organs.routes').then(m => m.ORGANS_ROUTES)
      },
      { 
        path: 'compatibility',
        loadChildren: () => import('./features/compatibility/compatibility.routes').then(m => m.COMPATIBILITY_ROUTES)
      },
      { 
        path: 'transportation',
        loadChildren: () => import('./features/transportation/transportation.routes').then(m => m.TRANSPORTATION_ROUTES)
      },
      { 
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' }
];