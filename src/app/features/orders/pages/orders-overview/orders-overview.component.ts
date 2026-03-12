import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/order.model';

@Component({
  selector: 'app-orders-overview',
  standalone: true,
  imports: [CommonModule, TopBarComponent, DecimalPipe],
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.scss'],
})
export class OrdersOverviewComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly router = inject(Router);

  orders = signal<OrderResponse[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
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

  openOrder(order: OrderResponse): void {
    this.router.navigate(['/orders', order.id]);
  }

  trackById(_: number, item: OrderResponse) {
    return item.id;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
    };
    return map[status] ?? status;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
