import { Routes } from '@angular/router';
import { TransportationListComponent } from './transportation-list/transportation-list.component';
import { TransportationDetailComponent } from './transportation-detail/transportation-detail.component';
import { TransportationFormComponent } from './transportation-form/transportation-form.component';

export const TRANSPORTATION_ROUTES: Routes = [
  {
    path: '',
    component: TransportationListComponent,
  },
  {
    path: 'new',
    component: TransportationFormComponent,
  },
  {
    path: ':id',
    component: TransportationDetailComponent,
  },
  {
    path: ':id/edit',
    component: TransportationFormComponent,
  },
];
