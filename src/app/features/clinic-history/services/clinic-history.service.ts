import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicHistory } from '../../../core/models/clinic-history.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicHistoryService {
  private apiUrl = `${environment.apiUrl}/clinic-history`;

  constructor(private http: HttpClient) {}

  getAllClinicHistories(): Observable<ClinicHistory[]> {
    return this.http.get<ClinicHistory[]>(this.apiUrl);
  }

  getClinicHistoryById(id: number): Observable<ClinicHistory> {
    return this.http.get<ClinicHistory>(`${this.apiUrl}/${id}`);
  }

  getClinicHistoryByPatient(
    patientId: number,
    patientType: 'donor' | 'receiver'
  ): Observable<ClinicHistory> {
    return this.http.get<ClinicHistory>(
      `${this.apiUrl}/patient/${patientType}/${patientId}`
    );
  }

  createClinicHistory(clinicHistory: ClinicHistory): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(this.apiUrl, clinicHistory);
  }

  updateClinicHistory(
    id: number,
    clinicHistory: ClinicHistory
  ): Observable<ClinicHistory> {
    return this.http.put<ClinicHistory>(`${this.apiUrl}/${id}`, clinicHistory);
  }

  deleteClinicHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Additional methods for specific clinic history data
  addVisit(clinicHistoryId: number, visit: any): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(
      `${this.apiUrl}/${clinicHistoryId}/visits`,
      visit
    );
  }

  addDiagnosis(
    clinicHistoryId: number,
    diagnosis: any
  ): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(
      `${this.apiUrl}/${clinicHistoryId}/diagnoses`,
      diagnosis
    );
  }

  addMedication(
    clinicHistoryId: number,
    medication: any
  ): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(
      `${this.apiUrl}/${clinicHistoryId}/medications`,
      medication
    );
  }

  addLabResult(
    clinicHistoryId: number,
    labResult: any
  ): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(
      `${this.apiUrl}/${clinicHistoryId}/lab-results`,
      labResult
    );
  }

  addImagingResult(
    clinicHistoryId: number,
    imagingResult: any
  ): Observable<ClinicHistory> {
    return this.http.post<ClinicHistory>(
      `${this.apiUrl}/${clinicHistoryId}/imaging-results`,
      imagingResult
    );
  }
}
