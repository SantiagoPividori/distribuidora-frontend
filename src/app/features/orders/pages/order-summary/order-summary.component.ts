import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UUID } from 'crypto';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../services/order.service';
import { OrderRequest, OrderResponse } from '../../models/order.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TopBarComponent],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  confirmed = signal(false);
  isLoading = signal(false);
  orderNumber = signal<number | null>(null);
  errorMsg = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.cartService.selectedClient()) {
      this.router.navigate(['/clients']);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  confirmOrder(): void {
    const client = this.cartService.selectedClient();
    if (!client) return;

    // ── Armar el payload exacto que espera el backend ──
    const payload: OrderRequest = {
      clientId: client.id as UUID,
      items: this.cartService.cartItems().map((item) => ({
        productId: item.product.id as UUID,
        quantity: item.quantity,
      })),
    };

    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.orderService.createOrder(payload).subscribe({
      next: (order: OrderResponse) => {
        this.orderNumber.set(order.orderNumber);
        this.isLoading.set(false);
        this.confirmed.set(true);
      },
      error: (err) => {
        console.error('Error creando orden', err);
        this.errorMsg.set('Hubo un error al confirmar el pedido. Intentá de nuevo.');
        this.isLoading.set(false);
      },
    });
  }

  newOrder(): void {
    this.cartService.reset();
    this.confirmed.set(false);
    this.router.navigate(['/clients']);
  }
}
