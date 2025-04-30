import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getTransplantReport(filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transplants`, {
      params: filters,
    });
  }

  getDonorReport(filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/donors`, { params: filters });
  }

  getReceiverReport(filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/receivers`, { params: filters });
  }

  getOrganUtilizationReport(filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/organ-utilization`, {
      params: filters,
    });
  }

  // Mock data methods for development
  getMockTransplantReport(filters: any): Observable<any> {
    console.log('Getting mock transplant report with filters:', filters);

    return of({
      metrics: {
        totalProcedures: 327,
        successRate: 94.2,
        avgProcedureTime: 4.7,
        scheduledProcedures: 42,
      },

      proceduresByOrgan: [
        { organType: 'Kidney', count: 157 },
        { organType: 'Liver', count: 83 },
        { organType: 'Heart', count: 42 },
        { organType: 'Lung', count: 29 },
        { organType: 'Pancreas', count: 16 },
      ],

      proceduresByMonth: [
        { month: 'Jan', count: 24 },
        { month: 'Feb', count: 19 },
        { month: 'Mar', count: 28 },
        { month: 'Apr', count: 31 },
        { month: 'May', count: 26 },
        { month: 'Jun', count: 32 },
        { month: 'Jul', count: 30 },
        { month: 'Aug', count: 29 },
        { month: 'Sep', count: 27 },
        { month: 'Oct', count: 33 },
        { month: 'Nov', count: 25 },
        { month: 'Dec', count: 23 },
      ],

      recentProcedures: [
        {
          id: 1234,
          date: new Date(),
          organType: 'Kidney',
          institution: 'Memorial Hospital',
          doctor: 'Dr. Smith',
          status: 'completed',
          duration: 3.5,
        },
        {
          id: 1235,
          date: new Date(),
          organType: 'Liver',
          institution: 'University Medical Center',
          doctor: 'Dr. Johnson',
          status: 'in_progress',
          duration: 4.2,
        },
        {
          id: 1236,
          date: new Date(Date.now() + 86400000), // Tomorrow
          organType: 'Heart',
          institution: 'Central Hospital',
          doctor: 'Dr. Williams',
          status: 'scheduled',
          duration: null,
        },
        {
          id: 1237,
          date: new Date(Date.now() - 86400000), // Yesterday
          organType: 'Lung',
          institution: 'Regional Medical Center',
          doctor: 'Dr. Brown',
          status: 'canceled',
          duration: null,
        },
        {
          id: 1238,
          date: new Date(Date.now() - 2 * 86400000), // 2 days ago
          organType: 'Kidney',
          institution: 'Memorial Hospital',
          doctor: 'Dr. Smith',
          status: 'completed',
          duration: 3.2,
        },
      ],
    });
  }

  getMockDonorReport(filters: any): Observable<any> {
    console.log('Getting mock donor report with filters:', filters);

    return of({
      metrics: {
        totalDonors: 542,
        activeDonors: 312,
        organsPerDonor: 1.8,
        averageDonorAge: 42.7,
      },

      donorsByAge: [
        { ageGroup: '18-25', count: 54 },
        { ageGroup: '26-35', count: 98 },
        { ageGroup: '36-45', count: 147 },
        { ageGroup: '46-55', count: 120 },
        { ageGroup: '56-65', count: 89 },
        { ageGroup: '66+', count: 34 },
      ],

      donorsByOrganType: [
        { organType: 'Kidney', count: 211 },
        { organType: 'Liver', count: 143 },
        { organType: 'Heart', count: 67 },
        { organType: 'Lung', count: 98 },
        { organType: 'Pancreas', count: 23 },
      ],

      recentDonors: [
        // Sample data would go here
      ],
    });
  }
}
