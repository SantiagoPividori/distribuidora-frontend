import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface DashboardService {
  totalAmount: number;
  pendingCount: number;
}

export interface Client {
  id?: number;
  businessName: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  taxId: string;
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

  getTodayRoute(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/customers/today-route`);
  }

  saveClient(clientData: Client): Observable<Client> {
    // Post recibe: (URL, Cuerpo de la petición)
    return this.http.post<Client>(`${environment.apiBaseUrl}/clients`, clientData);

  }
}