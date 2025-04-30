import { Routes } from '@angular/router';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { TransplantReportComponent } from './transplant-report/transplant-report.component';
import { DonorReportComponent } from './donor-report/donor-report.component';
import { ReceiverReportComponent } from './receiver-report/receiver-report.component';
import { OrganUtilizationReportComponent } from './organ-utilization-report/organ-utilization-report.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsListComponent,
  },
  {
    path: 'transplants',
    component: TransplantReportComponent,
  },
  {
    path: 'donors',
    component: DonorReportComponent,
  },
  {
    path: 'receivers',
    component: ReceiverReportComponent,
  },
  {
    path: 'organ-utilization',
    component: OrganUtilizationReportComponent,
  },
];
