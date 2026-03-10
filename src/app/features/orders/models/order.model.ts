import { UUID } from 'crypto';
import { ClientModel } from '../../clients/models/client-model';
import { ProductModel } from '../../products/models/product.model';

// ── Enums ──────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED';

// ── Request DTOs (lo que enviás al backend) ────────
export interface OrderItemRequest {
  productId: UUID;
  quantity: number;
}

export interface OrderRequest {
  clientId: UUID;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  id: UUID;
  orderNumber: number;
  clientBusinessName: string;
  clientId: UUID;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  itemCount: number;
}

export interface OrderItemResponse {
  id: UUID;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetailResponse {
  id: UUID;
  orderNumber: number;
  clientBusinessName: string;
  clientId: UUID;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItemResponse[];
}

// ── Response (lo que devuelve el backend) ──────────
export interface OrderItemResponse {
  id: UUID;
  product: ProductModel;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: UUID;
  orderNumber: number;
  client: ClientModel;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItemResponse[];
}