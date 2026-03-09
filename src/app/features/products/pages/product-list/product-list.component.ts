import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductUI } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TopBarComponent],
})
export class ProductListComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  allProducts = signal<ProductUI[]>([]);
  categories = signal<string[]>([]);
  activeCategory = signal('Todos');
  searchQuery = '';
  isLoading = false;
  saveError: string | null = null;
  showModal = false;
  isSaving = false;

  qtyMap: Record<string, number> = {};

  newProductForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  filteredProducts = computed(() => {
    const cat = this.activeCategory();
    return this.allProducts().filter((p) => {
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
        this.allProducts.set(data);
        this.categories.set(this.productService.getCategories(data));
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

  openModal(): void {
    this.newProductForm.reset();
    this.saveError = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProduct(): void {
    if (this.newProductForm.invalid) {
      this.newProductForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.saveError = null;

    this.productService.createProduct(this.newProductForm.getRawValue()).subscribe({
      next: () => {
        this.isSaving = false;
        this.showModal = false;
        this.loadProducts(); // recargar lista
      },
      error: (err) => {
        console.error('Error creando producto', err);
        this.saveError = 'No se pudo crear el producto. Verifica los datos.';
        this.isSaving = false;
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
