import { Routes } from '@angular/router';
import { InstitutionsListComponent } from './institutions-list/institutions-list.component';
import { InstitutionFormComponent } from './institution-form/institution-form.component';
import { InstitutionDetailComponent } from './institution-detail/institution-detail.component';

export const INSTITUTIONS_ROUTES: Routes = [
  { path: '', component: InstitutionsListComponent },
  { path: 'new', component: InstitutionFormComponent },
  { path: ':id', component: InstitutionDetailComponent },
  { path: ':id/edit', component: InstitutionFormComponent }
];