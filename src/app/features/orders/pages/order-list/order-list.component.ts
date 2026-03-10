import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../../../core/services/cart.service';
import { ClientService } from '../../../clients/services/client.service';
import { OrderResponse } from '../../models/order.model';
import { ClientUI } from '../../../clients/models/client-model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);
  private readonly clientService = inject(ClientService);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  orders = signal<OrderResponse[]>([]);
  client = signal<ClientUI | null>(null);
  isLoading = signal(true);
  clientId = '';

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';

    this.clientService.getById(this.clientId as any).subscribe({
      next: (c) =>
        this.client.set({ ...c, initial: c.businessName.charAt(0).toUpperCase(), tag: 'Regular' }),
      error: (err) => console.error('Error cargando cliente', err),
    });

    this.orderService.getOrdersByClient(this.clientId).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando órdenes', err);
        this.isLoading.set(false);
      },
    });
  }

  newOrder(): void {
    const c = this.client();
    if (c) {
      this.cartService.setClient(c);
      this.router.navigate(['/products']);
    }
  }

  trackById(_: number, item: OrderResponse) {
    return item.id;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmada',
      CANCELLED: 'Cancelada',
      DELIVERED: 'Entregada',
    };
    return map[status] ?? status;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  openOrder(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }
}
