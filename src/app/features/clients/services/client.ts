import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientModel } from '../models/client-model';
import { Observable } from 'rxjs';
import { ClientRequest } from '../models/client-model';
import { environment } from '../../../../environments/environment.development';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class Client {
  
  private readonly baseUrl = `${environment.apiBaseUrl}/clients`;

  constructor(private http: HttpClient) {
  }

  createClient(payload: ClientRequest): Observable<ClientModel> {
    return this.http.post<ClientModel>(`${this.baseUrl}`, payload);
  }

  listAllClients(): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(`${this.baseUrl}`);
  }

  searchByName(name: string): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(`${this.baseUrl}/search?name=${name}`);
  }

  getById(id: UUID): Observable<ClientModel> {
    return this.http.get<ClientModel>(`${this.baseUrl}/${id}`);
  }

  deleteClient(id: UUID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateClient(id: UUID, payload: ClientRequest): Observable<ClientModel> {
    return this.http.put<ClientModel>(`${this.baseUrl}/${id}`, payload);
  }

}
