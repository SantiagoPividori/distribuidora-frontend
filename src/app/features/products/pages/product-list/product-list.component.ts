import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductUI } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';

@Component({
  templateUrl: './html/product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent],
})
export class ProductListComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  allProducts: ProductUI[] = [];
  categories: string[] = [];
  activeCategory = signal('Todos');
  searchQuery = '';
  isLoading = false;

  qtyMap: Record<string, number> = {};

  filteredProducts = computed(() => {
    const cat = this.activeCategory();
    return this.allProducts.filter((p) => {
      const matchCat = cat === 'Todos' || p.category === cat;
      const matchSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  });

  ngOnInit(): void {
    if (!this.cartService.selectedClient()) {
      this.router.navigate(['/clients']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.listAllUI().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.categories = this.productService.getCategories(data);
        // seed qtyMap desde el carrito actual
        data.forEach((p) => {
          this.qtyMap[p.id as string] = this.cartService.getQuantity(p.id as string);
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading = false;
      },
    });
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }
  onSearch(query: string): void {
    this.searchQuery = query;
  }

  increment(id: string): void {
    this.qtyMap[id] = (this.qtyMap[id] || 0) + 1;
  }

  decrement(id: string): void {
    this.qtyMap[id] = Math.max(0, (this.qtyMap[id] || 0) - 1);
  }

  addToCart(product: ProductUI): void {
    const qty = this.qtyMap[product.id as string] || 0;
    this.cartService.setItem(product, qty);
  }

  goToSummary(): void {
    this.router.navigate(['/summary']);
  }
  goBack(): void {
    this.router.navigate(['/clients']);
  }

  trackById(_: number, item: ProductUI) {
    return item.id;
  }
}
