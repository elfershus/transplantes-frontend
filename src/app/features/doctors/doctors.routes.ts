import { Routes } from '@angular/router';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';

export const DOCTORS_ROUTES: Routes = [
  {
    path: '',
    component: DoctorsListComponent,
  },
  {
    path: 'new',
    component: DoctorFormComponent,
  },
  {
    path: ':id',
    component: DoctorDetailComponent,
  },
  {
    path: ':id/edit',
    component: DoctorFormComponent,
  },
];
