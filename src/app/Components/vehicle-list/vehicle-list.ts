import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit {

  private vehicleService = inject(VehicleService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  vehicles: Vehicle[] = [];
  currentSortOrder: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const hasSearchCriteria = params['city'] || params['startDate'] || params['endDate'];

      if (hasSearchCriteria) {
        this.performSearch(params);
      } else {
        this.loadAllVehicles();
      }
    });
  }

  loadAllVehicles(): void {
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;

        if (!this.currentSortOrder) {
          this.shuffleArray(this.vehicles);
        } else {
          this.applyLocalSort();
        }


      }
    });
  }

  performSearch(params: any): void {
    this.vehicleService.searchVehicles(params).subscribe({
      next: (data) => {
        // On assigne les données
        this.vehicles = data;

        // Si un tri était déjà actif, on l'applique
        if (this.currentSortOrder) {
          this.applyLocalSort();
        }

        // 4. IMPORTANT : On force la détection de changement ici aussi
        // Cela garantit que le @for détecte immédiatement les nouvelles voitures
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur recherche', err)
    });
  }

  onSortChange(event: Event): void {
    this.currentSortOrder = (event.target as HTMLSelectElement).value;
    this.applyLocalSort();
  }

  private applyLocalSort(): void {
    const sorted = [...this.vehicles];

    if (this.currentSortOrder === 'asc') {
      sorted.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (this.currentSortOrder === 'desc') {
      sorted.sort((a, b) => b.price_per_day - a.price_per_day);
    }

    this.vehicles = sorted;
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
