import { UUID } from 'crypto';
import { ClientUI } from '../../features/clients/models/client-model';

// ── Producto mínimo que necesita el carrito ────────
export interface CartProduct {
  id: UUID;
  name: string;
  description: string;
  price: number;
  stock: number;
  icon: string;
  category: string;
}

// ── Item del carrito ───────────────────────────────
export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export type { ClientUI };