import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  selectedDate = signal<string | null>(null);
  activeFilter = signal<'all' | 'today' | 'week' | 'month'>('all');

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

  loadOrders(date?: string): void {
    this.isLoading.set(true);
    this.orderService.getMyOrders(date).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  setQuickFilter(filter: 'all' | 'today' | 'week' | 'month'): void {
    this.activeFilter.set(filter);
    this.selectedDate.set(null);

    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];

    if (filter === 'today') {
      this.loadOrders(fmt(today));
    } else {
      this.loadOrders(); // all, week y month los filtramos en frontend
    }
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedDate.set(value);
    this.activeFilter.set('all');
    this.loadOrders(value || undefined);
  }

  ordersFiltered = computed(() => {
    const orders = this.orders();
    const filter = this.activeFilter();

    if (filter === 'all' || filter === 'today') return orders;

    const now = new Date();
    return orders.filter((o) => {
      const date = new Date(o.createdAt);
      if (filter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }
      if (filter === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true;
    });
  });
}
