// src/app/features/donors/services/donors.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donor } from '../../../core/models/donor.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonorsService {
  private apiUrl = `${environment.apiUrl}/donors`;
  
  constructor(private http: HttpClient) {}
  
  getDonors(params?: any): Observable<{ items: Donor[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Donor[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getDonor(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`);
  }
  
  createDonor(donor: Donor): Observable<Donor> {
    return this.http.post<Donor>(this.apiUrl, donor);
  }
  
  updateDonor(id: number, donor: Donor): Observable<Donor> {
    return this.http.put<Donor>(`${this.apiUrl}/${id}`, donor);
  }
  
  deleteDonor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getActiveDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/active`);
  }
  
  getDonorsByBloodType(bloodType: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/blood-type/${bloodType}`);
  }
  
  getDonorsWithAvailableOrgans(): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/with-available-organs`);
  }
}