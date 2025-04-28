// src/app/features/doctors/services/doctors.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../../../core/models/doctor.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private apiUrl = `${environment.apiUrl}/doctors`;
  
  constructor(private http: HttpClient) {}
  
  getDoctors(params?: any): Observable<{ items: Doctor[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Doctor[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
  
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }
  
  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
  }
  
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}