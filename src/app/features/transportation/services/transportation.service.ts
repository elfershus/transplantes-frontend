// src/app/features/transportation/services/transportation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transportation } from '../../../core/models/transportation.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransportationService {
  private apiUrl = `${environment.apiUrl}/transportation`;
  
  constructor(private http: HttpClient) {}
  
  getTransportations(params?: any): Observable<{ items: Transportation[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Transportation[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getTransportation(id: number): Observable<Transportation> {
    return this.http.get<Transportation>(`${this.apiUrl}/${id}`);
  }
  
  createTransportation(transportation: Transportation): Observable<Transportation> {
    return this.http.post<Transportation>(this.apiUrl, transportation);
  }
  
  updateTransportation(id: number, transportation: Transportation): Observable<Transportation> {
    return this.http.put<Transportation>(`${this.apiUrl}/${id}`, transportation);
  }
  
  deleteTransportation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getActiveTransportations(): Observable<Transportation[]> {
    return this.http.get<Transportation[]>(`${this.apiUrl}/active`);
  }
  
  getDelayedTransportations(): Observable<Transportation[]> {
    return this.http.get<Transportation[]>(`${this.apiUrl}/delayed`);
  }
  
  getTransportationEfficiencyReport(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<any>(`${this.apiUrl}/reports/efficiency`, { params });
  }
  
  getTransportationRouteAnalysis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/routes`);
  }
}