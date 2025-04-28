// src/app/features/reports/services/reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;
  
  constructor(private http: HttpClient) {}
  
  getSystemOverview(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overview`);
  }
  
  getTransplantStatistics(startDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get(`${this.apiUrl}/transplants`, { params });
  }
  
  getWaitlistStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/waitlist`);
  }
  
  getOrganMatchingStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matches`);
  }
  
  getTransportationEfficiencyReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transportation`);
  }
  
  exportReport(reportType: string, format: 'pdf' | 'csv' | 'excel', startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams()
      .set('type', reportType)
      .set('format', format);
    
    if (startDate && endDate) {
      params = params
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString());
    }
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }
}