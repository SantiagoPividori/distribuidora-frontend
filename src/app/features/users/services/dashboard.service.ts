import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ClientModel } from '../../clients/models/client-model';

export interface DashboardService {
  totalAmount: number;
  pendingCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/user`;

  getDailyStats(): Observable<DashboardService> {
    return this.http.get<DashboardService>(`${this.apiUrl}/stats/daily`);
  }

  getTodayRoute(): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(`${this.apiUrl}/customers/today-route`);
  }

  saveClient(clientData: ClientModel): Observable<ClientModel> {
    // Post recibe: (URL, Cuerpo de la petición)
    return this.http.post<ClientModel>(`${environment.apiBaseUrl}/clients`, clientData);

  }
}