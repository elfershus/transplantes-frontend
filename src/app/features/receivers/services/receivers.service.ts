// src/app/features/receivers/services/receivers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receiver } from '../../../core/models/receiver.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiversService {
  private apiUrl = `${environment.apiUrl}/receivers`;
  
  constructor(private http: HttpClient) {}
  
  getReceivers(params?: any): Observable<{ items: Receiver[], pagination: any }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<{ items: Receiver[], pagination: any }>(this.apiUrl, { params: httpParams });
  }
  
  getReceiver(id: number): Observable<Receiver> {
    return this.http.get<Receiver>(`${this.apiUrl}/${id}`);
  }
  
  createReceiver(receiver: Receiver): Observable<Receiver> {
    return this.http.post<Receiver>(this.apiUrl, receiver);
  }
  
  updateReceiver(id: number, receiver: Receiver): Observable<Receiver> {
    return this.http.put<Receiver>(`${this.apiUrl}/${id}`, receiver);
  }
  
  deleteReceiver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getWaitingReceivers(): Observable<Receiver[]> {
    return this.http.get<Receiver[]>(`${this.apiUrl}/waiting`);
  }
  
  getReceiversByUrgencyLevel(level: number): Observable<Receiver[]> {
    return this.http.get<Receiver[]>(`${this.apiUrl}/urgency/${level}`);
  }
  
  getReceiversByBloodType(bloodType: string, organType?: string): Observable<Receiver[]> {
    let url = `${this.apiUrl}/blood-type/${bloodType}`;
    
    if (organType) {
      url += `?organType=${organType}`;
    }
    
    return this.http.get<Receiver[]>(url);
  }
  
  getWaitlistStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/waitlist`);
  }
}