// src/app/features/organs/services/organs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organ } from '../../../core/models/organ.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgansService {
  private apiUrl = `${environment.apiUrl}/organs`;
  
  constructor(private http: HttpClient) {}
  
  getOrgans(params?: any): Observable<{ items: Organ[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Organ[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getOrgan(id: number): Observable<Organ> {
    return this.http.get<Organ>(`${this.apiUrl}/${id}`);
  }
  
  createOrgan(organ: Organ): Observable<Organ> {
    return this.http.post<Organ>(this.apiUrl, organ);
  }
  
  updateOrgan(id: number, organ: Organ): Observable<Organ> {
    return this.http.put<Organ>(`${this.apiUrl}/${id}`, organ);
  }
  
  deleteOrgan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getAvailableOrgans(): Observable<Organ[]> {
    return this.http.get<Organ[]>(`${this.apiUrl}/available`);
  }
  
  getAvailableOrgansByType(type: string): Observable<Organ[]> {
    return this.http.get<Organ[]>(`${this.apiUrl}/available/${type}`);
  }
  
  getExpiringOrgans(hours: number = 24): Observable<Organ[]> {
    return this.http.get<Organ[]>(`${this.apiUrl}/expiring?hours=${hours}`);
  }
  
  getOrganStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
  
  getOrganLifespanStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/lifespan`);
  }
}