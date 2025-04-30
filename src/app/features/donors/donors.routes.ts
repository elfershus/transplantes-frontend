import { Routes } from '@angular/router';
import { DonorsListComponent } from './donors-list/donors-list.component';
import { DonorDetailComponent } from './donor-detail/donor-detail.component';
import { DonorFormComponent } from './donor-form/donor-form.component';

export const DONORS_ROUTES: Routes = [
  {
    path: '',
    component: DonorsListComponent,
  },
  {
    path: 'new',
    component: DonorFormComponent,
  },
  {
    path: ':id',
    component: DonorDetailComponent,
  },
  {
    path: ':id/edit',
    component: DonorFormComponent,
  },
];
