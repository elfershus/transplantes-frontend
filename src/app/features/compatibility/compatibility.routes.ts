// src/app/features/compatibility/compatibility.routes.ts
import { Routes } from '@angular/router';
import { CompatibilityListComponent } from './compatibility-list/compatibility-list.component';
import { CompatibilityFormComponent } from './compatibility-form/compatibility-form.component';
import { CompatibilityDetailComponent } from './compatibility-detail/compatibility-detail.component';

export const COMPATIBILITY_ROUTES: Routes = [
  { path: '', component: CompatibilityListComponent },
  { path: 'new', component: CompatibilityFormComponent },
  { path: ':id', component: CompatibilityDetailComponent },
  { path: ':id/edit', component: CompatibilityFormComponent }
];