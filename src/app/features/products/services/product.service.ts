import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UUID } from 'crypto';
import { ProductModel, ProductUI, toProductUI } from '../models/product.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  // ── GET /api/products ────────────────────────────
  listAll(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.baseUrl);
  }

  // ── GET /api/products/{id} ───────────────────────
  getById(id: UUID): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.baseUrl}/${id}`);
  }

  // ── POST /api/products ───────────────────────────
  create(payload: Partial<ProductModel>): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.baseUrl, payload);
  }

  // ── PUT /api/products/{id} ───────────────────────
  update(id: UUID, payload: Partial<ProductModel>): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.baseUrl}/${id}`, payload);
  }

  // ── DELETE /api/products/{id} ────────────────────
  delete(id: UUID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ── UI ───────────────────────────────────────────
  listAllUI(): Observable<ProductUI[]> {
    return this.listAll().pipe(
      map(products => products.map(toProductUI))
    );
  }

  getCategories(products: ProductUI[]): string[] {
    return ['Todos', ...new Set(products.map(p => p.category))];
  }
}