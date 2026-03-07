import { UUID } from 'crypto';
import { CartProduct } from '../../../core/services/cart.model';

// ── Backend entity ─────────────────────────────────
export interface ProductModel {
  id: UUID;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

// ── UI extiende CartProduct ────────────────────────
export interface ProductUI extends CartProduct {}

// ── Conversión ─────────────────────────────────────
export function toProductUI(product: ProductModel): ProductUI {
  return {
    ...product,
    icon: resolveIcon(product.name),
    category: resolveCategory(product.name),
  };
}

function resolveIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('aceite'))     return '🫙';
  if (n.includes('arroz'))      return '🌾';
  if (n.includes('azucar') || n.includes('azúcar')) return '🍬';
  if (n.includes('fideo'))      return '🍝';
  if (n.includes('leche'))      return '🥛';
  if (n.includes('detergente')) return '🧼';
  if (n.includes('jabon') || n.includes('jabón'))   return '🧴';
  if (n.includes('papel'))      return '🧻';
  if (n.includes('atun') || n.includes('atún'))     return '🐟';
  if (n.includes('galleta'))    return '🍪';
  return '📦';
}

function resolveCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('aceite'))                          return 'Aceites';
  if (n.includes('arroz') || n.includes('fideo'))    return 'Granos';
  if (n.includes('leche'))                           return 'Lácteos';
  if (n.includes('detergente') || n.includes('jabon') || n.includes('papel')) return 'Limpieza';
  if (n.includes('atun'))                            return 'Enlatados';
  if (n.includes('galleta'))                         return 'Snacks';
  return 'Abarrotes';
}