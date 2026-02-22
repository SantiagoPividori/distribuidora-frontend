import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/service/dashboard.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  isModalOpen = signal(false);
  clientForm = this.fb.nonNullable.group({
    businessName: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    taxId: ['', [Validators.required]]
  });

  crearNuevoCliente() {
    this.router.navigate(['clientes', 'nuevo']);
  }

  openCreateClientModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.clientForm.reset();
  }

  saveClient() {
  if (this.clientForm.valid) {
    const payload = this.clientForm.getRawValue(); // Obtenemos los datos del form

    this.dashboardService.saveClient(payload).subscribe({
      next: (savedClient) => {
        console.log('Cliente guardado con éxito', savedClient);
        
        // Actualizamos la lista local para que el nuevo cliente aparezca sin recargar
        this.clients.update(prev => [...prev, savedClient]);
        
        this.closeModal(); // Cerramos el formulario flotante
        this.clientForm.reset(); // Limpia los campos del formulario para volver a ingresar otro
      },
      error: (err) => {
        console.error('Error al guardar cliente', err);
        alert('No se pudo guardar el cliente. Revisa la conexión.');
      }
    });
  }
}

  username = signal('Cargando...');

  get getPendingVisits() {
    return this.pendingVisits;
  }
  pendingVisits = signal(0);
  totalSales = signal(0);
  clients = signal<any[]>([]);

  ngOnInit(): void {
    this.cargarDatos();
  }

  viewOptionsClient(clientId: number | string): void {
    console.log('Abriendo opciones para el cliente:', clientId);
    this.router.navigate(['/clientes', clientId, 'opciones']);
  }

  cargarDatos() {
    // Llamada a estadísticas
    this.dashboardService.getDailyStats().subscribe({
      next: (stats) => {
        this.totalSales.set(stats.totalAmount);
        this.pendingVisits.set(stats.pendingCount);
      },
      error: (err) => console.error('Error en stats', err)
    });

    // Llamada a la lista de clientes
    this.dashboardService.getTodayRoute().subscribe({
      next: (res) => this.clients.set(res),
      error: (err) => console.error('Error en ruta', err)
    });
  }
}