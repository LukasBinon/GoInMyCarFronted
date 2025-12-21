import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Important : règle les erreurs rouges du HTML
import { VehicleService } from '../../services/vehicle';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-panel',
  standalone: true, // Assurez-vous que standalone est bien présent
  imports: [
    ReactiveFormsModule,
    CommonModule // Nécessaire pour [formGroup], [value], [disabled] et les filtres
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private vehicleService = inject(VehicleService);
  private fb = inject(FormBuilder);

  // US-11 : Signal pour la liste des véhicules
  vehicles = signal<any[]>([]);

  // US-02 : Signal pour les villes dynamiques
  cities = toSignal(this.vehicleService.getLocations(), { initialValue: [] });

  // US-8 : Formulaire avec tous les champs du DTO
  vehicleForm = this.fb.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    price_per_day: [0, [Validators.required, Validators.min(1)]],
    is_available: [true],
    location: ['', Validators.required],
    image_url: [''],
    seat_count: [5],
    car_description: [''],
    transmission: ['Automatic'],
    fuel_type: ['Electric']
  });

  constructor() {
    this.loadVehicles();
  }

  // Charge tous les véhicules (incluant le statut pour l'admin)
  loadVehicles() {
    this.vehicleService.getAll().subscribe(data => this.vehicles.set(data));
  }

  // US-8 : Logique d'ajout
  onSubmit() {
    if (this.vehicleForm.valid) {
      this.vehicleService.addVehicle(this.vehicleForm.value).subscribe(() => {
        this.loadVehicles(); // Rafraîchit la liste US-11
        this.vehicleForm.reset({ is_available: true, seat_count: 5 });
      });
    }
  }

  // US-10 : Logique de modification du prix
  onUpdatePrice(v: any) {
    const newPrice = prompt(`Nouveau prix pour ${v.make} ${v.model} :`, v.price_per_day);
    if (newPrice && !isNaN(Number(newPrice))) {
      const updatedVehicle = { ...v, price_per_day: Number(newPrice) };
      this.vehicleService.updateVehicle(v.vehicle_id, updatedVehicle).subscribe(() => {
        this.loadVehicles();
      });
    }
  }

  // US-9 : Logique de suppression
  onDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce véhicule de la flotte ?')) {
      this.vehicleService.deleteVehicle(id).subscribe(() => {
        this.loadVehicles();
      });
    }
  }
}
