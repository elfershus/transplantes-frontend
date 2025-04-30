// src/app/features/transplant-procedures/services/transplant-procedures.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransplantProcedure } from '../../../core/models/transplant-procedure.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransplantProceduresService {
  private apiUrl = `${environment.apiUrl}/transplant-procedures`;

  constructor(private http: HttpClient) {}

  getProcedures(
    params?: any
  ): Observable<{ items: TransplantProcedure[]; pagination: any }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<{ items: TransplantProcedure[]; pagination: any }>(
      this.apiUrl,
      { params: httpParams }
    );
  }

  getTransplantProcedure(id: number): Observable<TransplantProcedure> {
    return this.http.get<TransplantProcedure>(`${this.apiUrl}/${id}`);
  }

  createTransplantProcedure(
    procedure: TransplantProcedure
  ): Observable<TransplantProcedure> {
    return this.http.post<TransplantProcedure>(this.apiUrl, procedure);
  }

  updateTransplantProcedure(
    id: number,
    procedure: TransplantProcedure
  ): Observable<TransplantProcedure> {
    return this.http.put<TransplantProcedure>(
      `${this.apiUrl}/${id}`,
      procedure
    );
  }

  deleteProcedure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUpcomingProcedures(): Observable<TransplantProcedure[]> {
    return this.http.get<TransplantProcedure[]>(`${this.apiUrl}/upcoming`);
  }

  getProceduresByDoctor(doctorId: number): Observable<TransplantProcedure[]> {
    return this.http.get<TransplantProcedure[]>(
      `${this.apiUrl}/doctor/${doctorId}`
    );
  }

  getProceduresByInstitution(
    institutionId: number
  ): Observable<TransplantProcedure[]> {
    return this.http.get<TransplantProcedure[]>(
      `${this.apiUrl}/institution/${institutionId}`
    );
  }

  getProceduresByReceiver(
    receiverId: number
  ): Observable<TransplantProcedure[]> {
    return this.http.get<TransplantProcedure[]>(
      `${this.apiUrl}/receiver/${receiverId}`
    );
  }

  getSuccessRateReport(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any>(`${this.apiUrl}/reports/success-rate`, {
      params,
    });
  }
}
