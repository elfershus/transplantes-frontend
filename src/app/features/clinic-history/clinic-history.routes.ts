import { Routes } from '@angular/router';
import { ClinicHistoryListComponent } from './clinic-history-list/clinic-history-list.component';
import { ClinicHistoryDetailComponent } from './clinic-history-detail/clinic-history-detail.component';
import { ClinicHistoryFormComponent } from './clinic-history-form/clinic-history-form.component';

export const CLINIC_HISTORY_ROUTES: Routes = [
  {
    path: '',
    component: ClinicHistoryListComponent,
  },
  {
    path: 'new',
    component: ClinicHistoryFormComponent,
  },
  {
    path: ':id',
    component: ClinicHistoryDetailComponent,
  },
  {
    path: ':id/edit',
    component: ClinicHistoryFormComponent,
  },
];
