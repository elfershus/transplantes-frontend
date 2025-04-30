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
        loadChildren: () =>
          import('./features/doctors/doctors.routes').then(
            (m) => m.DOCTORS_ROUTES
          ),
      },
      {
        path: 'institutions',
        loadChildren: () =>
          import('./features/institutions/institutions.routes').then(
            (m) => m.INSTITUTIONS_ROUTES
          ),
      },
      {
        path: 'donors',
        loadChildren: () =>
          import('./features/donors/donors.routes').then(
            (m) => m.DONORS_ROUTES
          ),
      },
      {
        path: 'receivers',
        loadChildren: () =>
          import('./features/receivers/receivers.routes').then(
            (m) => m.RECEIVERS_ROUTES
          ),
      },
      {
        path: 'organs',
        loadChildren: () =>
          import('./features/organs/organs.routes').then(
            (m) => m.ORGANS_ROUTES
          ),
      },
      {
        path: 'compatibility',
        loadChildren: () =>
          import('./features/compatibility/compatibility.routes').then(
            (m) => m.COMPATIBILITY_ROUTES
          ),
      },
      {
        path: 'transportation',
        loadChildren: () =>
          import('./features/transportation/transportation.routes').then(
            (m) => m.TRANSPORTATION_ROUTES
          ),
      },
      {
        path: 'transplant-procedures',
        loadChildren: () =>
          import(
            './features/transplant-procedures/transplant-procedures.routes'
          ).then((m) => m.TRANSPLANT_PROCEDURES_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.routes').then(
            (m) => m.REPORTS_ROUTES
          ),
      },
      {
        path: 'clinic-history',
        loadChildren: () =>
          import('./features/clinic-history/clinic-history.routes').then(
            (m) => m.CLINIC_HISTORY_ROUTES
          ),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'donors',
    loadComponent: () =>
      import('./features/donors/donors-list/donors-list.component').then(
        (c) => c.DonorsListComponent
      ),
  },
  {
    path: 'donors/:id',
    loadComponent: () =>
      import('./features/donors/donor-detail/donor-detail.component').then(
        (c) => c.DonorDetailComponent
      ),
  },
  {
    path: 'donors/:id/edit',
    loadComponent: () =>
      import('./features/donors/donor-form/donor-form.component').then(
        (c) => c.DonorFormComponent
      ),
  },
  {
    path: 'receivers',
    loadComponent: () =>
      import(
        './features/receivers/receivers-list/receivers-list.component'
      ).then((c) => c.ReceiversListComponent),
  },
  {
    path: 'receivers/:id',
    loadComponent: () =>
      import(
        './features/receivers/receiver-detail/receiver-detail.component'
      ).then((c) => c.ReceiverDetailComponent),
  },
  {
    path: 'receivers/edit/:id',
    loadComponent: () =>
      import('./features/receivers/receiver-form/receiver-form.component').then(
        (c) => c.ReceiverFormComponent
      ),
  },
  {
    path: 'organs',
    loadComponent: () =>
      import('./features/organs/organs-list/organs-list.component').then(
        (c) => c.OrgansListComponent
      ),
  },
  {
    path: 'organs/:id',
    loadComponent: () =>
      import('./features/organs/organ-detail/organ-detail.component').then(
        (c) => c.OrganDetailComponent
      ),
  },
  {
    path: 'compatibility',
    loadComponent: () =>
      import(
        './features/compatibility/compatibility-list/compatibility-list.component'
      ).then((c) => c.CompatibilityListComponent),
  },
  {
    path: 'transplant-procedures',
    loadComponent: () =>
      import(
        './features/transplant-procedures/transplant-procedures-list/transplant-procedures-list.component'
      ).then((c) => c.TransplantProceduresListComponent),
  },
  {
    path: 'transplant-procedures/:id',
    loadComponent: () =>
      import(
        './features/transplant-procedures/transplant-procedure-detail/transplant-procedure-detail.component'
      ).then((c) => c.TransplantProcedureDetailComponent),
  },
  {
    path: 'transportation',
    loadComponent: () =>
      import(
        './features/transportation/transportation-list/transportation-list.component'
      ).then((c) => c.TransportationListComponent),
  },
  {
    path: 'transportation/:id',
    loadComponent: () =>
      import(
        './features/transportation/transportation-detail/transportation-detail.component'
      ).then((c) => c.TransportationDetailComponent),
  },
  {
    path: 'clinic-history',
    loadComponent: () =>
      import(
        './features/clinic-history/clinic-history-list/clinic-history-list.component'
      ).then((c) => c.ClinicHistoryListComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports-list/reports-list.component').then(
        (c) => c.ReportsListComponent
      ),
  },
  {
    path: 'reports/transplant/:id',
    loadComponent: () =>
      import(
        './features/reports/transplant-report/transplant-report.component'
      ).then((c) => c.TransplantReportComponent),
  },
  {
    path: 'reports/donor/:id',
    loadComponent: () =>
      import('./features/reports/donor-report/donor-report.component').then(
        (c) => c.DonorReportComponent
      ),
  },
  {
    path: 'reports/receiver/:id',
    loadComponent: () =>
      import(
        './features/reports/receiver-report/receiver-report.component'
      ).then((c) => c.ReceiverReportComponent),
  },
  {
    path: 'reports/organ-utilization',
    loadComponent: () =>
      import(
        './features/reports/organ-utilization-report/organ-utilization-report.component'
      ).then((c) => c.OrganUtilizationReportComponent),
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./features/doctors/doctors-list/doctors-list.component').then(
        (c) => c.DoctorsListComponent
      ),
  },
  {
    path: 'doctors/:id',
    loadComponent: () =>
      import('./features/doctors/doctor-detail/doctor-detail.component').then(
        (c) => c.DoctorDetailComponent
      ),
  },
  {
    path: 'doctors/edit/:id',
    loadComponent: () =>
      import('./features/doctors/doctor-edit/doctor-edit.component').then(
        (c) => c.DoctorEditComponent
      ),
  },
  {
    path: 'institutions',
    loadComponent: () =>
      import(
        './features/institutions/institutions-list/institutions-list.component'
      ).then((c) => c.InstitutionsListComponent),
  },
  {
    path: 'institutions/:id',
    loadComponent: () =>
      import(
        './features/institutions/institution-detail/institution-detail.component'
      ).then((c) => c.InstitutionDetailComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
