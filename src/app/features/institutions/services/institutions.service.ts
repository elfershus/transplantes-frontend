// src/app/features/institutions/services/institutions.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institution } from '../../../core/models/institution.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {
  private apiUrl = `${environment.apiUrl}/institutions`;
  
  constructor(private http: HttpClient) {}
  
  getInstitutions(params?: any): Observable<{ items: Institution[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Institution[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getInstitution(id: number): Observable<Institution> {
    return this.http.get<Institution>(`${this.apiUrl}/${id}`);
  }
  
  createInstitution(institution: Institution): Observable<Institution> {
    return this.http.post<Institution>(this.apiUrl, institution);
  }
  
  updateInstitution(id: number, institution: Institution): Observable<Institution> {
    return this.http.put<Institution>(`${this.apiUrl}/${id}`, institution);
  }
  
  deleteInstitution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getInstitutionsWithAvailableOrgans(): Observable<Institution[]> {
    return this.http.get<Institution[]>(`${this.apiUrl}/with-available-organs`);
  }
}