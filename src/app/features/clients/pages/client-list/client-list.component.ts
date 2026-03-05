import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TopBarComponent } from '../../../../components/shared/top-bar/top-bar.component';
import { ClientService } from '../../services/client.service';
import { CartService } from '../../../../core/services/cart.service';
import { ClientUI } from '../../models/client-model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TopBarComponent],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly cartService   = inject(CartService);
  private readonly router        = inject(Router);
  private readonly fb            = inject(FormBuilder);

  clients: ClientUI[]  = [];
  searchQuery          = '';
  isLoading            = false;
  showModal            = false;
  isSaving             = false;
  saveError: string | null = null;

  newClientForm = this.fb.nonNullable.group({
    businessName: ['', [Validators.required]],
    firstName:    [''],
    lastName:     [''],
    address:      ['', [Validators.required]],
    phoneNumber:  [''],
    taxId:        [''],
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.listAllClientsUI().subscribe({
      next:  data  => { this.clients = data; this.isLoading = false; },
      error: err   => { console.error('Error cargando clientes', err); this.isLoading = false; },
    });
  }

  onSearch(query: string): void {
    if (!query.trim()) { this.loadClients(); return; }
    this.clientService.searchByNameUI(query).subscribe({
      next:  data => this.clients = data,
      error: err  => console.error('Error buscando', err),
    });
  }

  selectClient(client: ClientUI): void {
    this.cartService.setClient(client);
    this.router.navigate(['/products']);
  }

  // ── Modal ────────────────────────────────────────
  openModal(): void {
    this.newClientForm.reset();
    this.saveError = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveClient(): void {
    if (this.newClientForm.invalid) {
      this.newClientForm.markAllAsTouched();
      return;
    }

    this.isSaving  = true;
    this.saveError = null;

    this.clientService.createClient(this.newClientForm.getRawValue()).subscribe({
      next: () => {
        this.isSaving   = false;
        this.showModal  = false;
        this.loadClients(); // recargar lista
      },
      error: err => {
        console.error('Error creando cliente', err);
        this.saveError = 'No se pudo crear el cliente. Verificá los datos.';
        this.isSaving  = false;
      },
    });
  }

  trackById(_: number, item: ClientUI) { return item.id; }
}