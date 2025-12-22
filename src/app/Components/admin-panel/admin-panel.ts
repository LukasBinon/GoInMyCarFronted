import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private vehicleService = inject(VehicleService);
  private fb = inject(FormBuilder);

  vehicles = signal<any[]>([]);
  cities = toSignal(this.vehicleService.getLocations(), { initialValue: [] });

  // US-8: Full form with all required fields from DTO
  vehicleForm = this.fb.group({
    make: ['', [Validators.required, Validators.minLength(2)]],
    model: ['', Validators.required],
    price_per_day: [0, [Validators.required, Validators.min(1)]],
    is_available: [true, Validators.required],
    image_url: ['', Validators.required],
    location: ['', Validators.required],
    seat_count: [5, [Validators.required, Validators.min(1), Validators.max(9)]],
    car_description: ['', [Validators.required, Validators.maxLength(500)]],
    transmission: ['Automatic', Validators.required],
    fuel_type: ['Electric', Validators.required]
  });

  constructor() { this.loadVehicles(); }

  loadVehicles() {
    this.vehicleService.getAll().subscribe(data => this.vehicles.set(data));
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.vehicleService.addVehicle(this.vehicleForm.value).subscribe({
        next: () => {
          this.loadVehicles();
          this.vehicleForm.reset({ is_available: true, seat_count: 5, transmission: 'Automatic', fuel_type: 'Electric' });
          alert('Vehicle added successfully!');
        },
        error: () => alert('An error occurred while saving the vehicle.')
      });
    } else {
      this.vehicleForm.markAllAsTouched(); // Trigger error display
    }
  }

  // US-10: Update logic
  onUpdatePrice(v: any) {
    const newPrice = prompt(`Update price for ${v.make} ${v.model}:`, v.price_per_day.toString());
    if (newPrice && !isNaN(Number(newPrice))) {
      const updatedVehicle = { ...v, price_per_day: Number(newPrice) };
      this.vehicleService.updateVehicle(v.vehicle_id, updatedVehicle).subscribe(() => this.loadVehicles());
    }
  }

  // US-9: Delete logic
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this vehicle from the fleet?')) {
      this.vehicleService.deleteVehicle(id).subscribe(() => this.loadVehicles());
    }
  }
}
