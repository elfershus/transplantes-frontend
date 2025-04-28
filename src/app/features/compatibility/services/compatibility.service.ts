// src/app/features/compatibility/services/compatibility.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compatibility } from '../../../core/models/compatibility.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompatibilityService {
  private apiUrl = `${environment.apiUrl}/compatibility`;
  
  constructor(private http: HttpClient) {}
  
  getCompatibilityRecords(params?: any): Observable<{ items: Compatibility[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Compatibility[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getCompatibilityRecord(id: number): Observable<Compatibility> {
    return this.http.get<Compatibility>(`${this.apiUrl}/${id}`);
  }
  
  createCompatibilityRecord(compatibility: Compatibility): Observable<Compatibility> {
    return this.http.post<Compatibility>(this.apiUrl, compatibility);
  }
  
  updateCompatibilityRecord(id: number, compatibility: Compatibility): Observable<Compatibility> {
    return this.http.put<Compatibility>(`${this.apiUrl}/${id}`, compatibility);
  }
  
  deleteCompatibilityRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getPotentialMatchesForOrgan(organId: number): Observable<Compatibility[]> {
    return this.http.get<Compatibility[]>(`${this.apiUrl}/organ/${organId}/potential`);
  }
  
  getPotentialMatchesForReceiver(receiverId: number): Observable<Compatibility[]> {
    return this.http.get<Compatibility[]>(`${this.apiUrl}/receiver/${receiverId}/potential`);
  }
  
  getConfirmedMatches(): Observable<Compatibility[]> {
    return this.http.get<Compatibility[]>(`${this.apiUrl}/confirmed`);
  }
  
  getMatchingStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}