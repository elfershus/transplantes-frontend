// src/app/features/transplant-procedures/transplant-procedures.routes.ts
import { Routes } from '@angular/router';
import { TransplantProceduresListComponent } from './transplant-procedures-list/transplant-procedures-list.component';
import { TransplantProcedureFormComponent } from './transplant-procedure-form/transplant-procedure-form.component';
import { TransplantProcedureDetailComponent } from './transplant-procedure-detail/transplant-procedure-detail.component';

export const TRANSPLANT_PROCEDURES_ROUTES: Routes = [
  { path: '', component: TransplantProceduresListComponent },
  { path: 'new', component: TransplantProcedureFormComponent },
  { path: ':id', component: TransplantProcedureDetailComponent },
  { path: ':id/edit', component: TransplantProcedureFormComponent },
];
