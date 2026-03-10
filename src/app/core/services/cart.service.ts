import { Injectable, signal, computed } from '@angular/core';
import { ClientUI } from '../../features/clients/models/client-model';
import { CartItem } from './cart.model';
import { ProductUI } from '../../features/products/models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly selectedClient = signal<ClientUI | null>(null);
  private readonly _cart = signal<Map<string, CartItem>>(new Map());

  readonly cartItems = computed<CartItem[]>(() => Array.from(this._cart().values()));

  readonly itemCount = computed<number>(() =>
    this.cartItems().reduce((sum, i) => sum + i.quantity, 0),
  );

  readonly subtotal = computed<number>(() =>
    this.cartItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  readonly total = computed<number>(() => this.subtotal());
  readonly hasItems = computed<boolean>(() => this._cart().size > 0);

  setClient(client: ClientUI): void {
    this.selectedClient.set(client);
    this.clearCart();
  }

  setItem(product: ProductUI, quantity: number): void {
    const map = new Map(this._cart());
    const key = product.id as string;
    if (quantity <= 0) {
      map.delete(key);
    } else {
      map.set(key, { product, quantity });
    }
    this._cart.set(map);
  }

  getQuantity(productId: string): number {
    return this._cart().get(productId)?.quantity ?? 0;
  }

  isInCart(productId: string): boolean {
    return this._cart().has(productId);
  }

  clearCart(): void {
    this._cart.set(new Map());
  }

  reset(): void {
    this.selectedClient.set(null);
    this.clearCart();
  }
}
