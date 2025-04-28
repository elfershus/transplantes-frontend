// src/app/features/receivers/receivers.routes.ts
import { Routes } from '@angular/router';
import { ReceiversListComponent } from './receivers-list/receivers-list.component';
import { ReceiverFormComponent } from './receiver-form/receiver-form.component';
import { ReceiverDetailComponent } from './receiver-detail/receiver-detail.component';

export const RECEIVERS_ROUTES: Routes = [
  { path: '', component: ReceiversListComponent },
  { path: 'new', component: ReceiverFormComponent },
  { path: ':id', component: ReceiverDetailComponent },
  { path: ':id/edit', component: ReceiverFormComponent }
];