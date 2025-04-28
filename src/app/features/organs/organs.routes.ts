// src/app/features/organs/organs.routes.ts
import { Routes } from '@angular/router';
import { OrgansListComponent } from './organs-list/organs-list.component';
import { OrganFormComponent } from './organ-form/organ-form.component';
import { OrganDetailComponent } from './organ-detail/organ-detail.component';

export const ORGANS_ROUTES: Routes = [
  { path: '', component: OrgansListComponent },
  { path: 'new', component: OrganFormComponent },
  { path: ':id', component: OrganDetailComponent },
  { path: ':id/edit', component: OrganFormComponent }
];