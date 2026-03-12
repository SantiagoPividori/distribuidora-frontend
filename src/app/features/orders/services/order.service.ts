import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UUID } from 'crypto';
import { OrderDetailResponse, OrderRequest, OrderResponse } from '../models/order.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  // ── POST /api/orders ─────────────────────────────
  createOrder(payload: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, payload);
  }

  // ── GET /api/orders/my-orders ────────────────────
  getMyOrders(date?: string): Observable<OrderResponse[]> {
    const params = date ? `?date=${date}` : '';
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/my-orders${params}`);
  }

  // ── GET /api/orders/{id} ─────────────────────────
  getById(id: UUID): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }

  // ── PATCH /api/orders/{id}/cancel ────────────────
  cancelOrder(id: UUID): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${id}/cancel`, {});
  }

  getOrdersByClient(clientId: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/clients/${clientId}`);
  }

  getOrderById(id: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.baseUrl}/${id}`);
  }

  updateOrderStatus(
    id: string,
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED',
  ): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${id}/status`, { status } );
  }
}
