import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { VehicleService } from '../../services/vehicle';
import { Router } from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  fb = inject(FormBuilder);
  vehicleService = inject(VehicleService);
  router = inject(Router);

  cities = toSignal(this.vehicleService.getLocations(), { initialValue: [] });

  // On initialise sans validateurs individuels
  searchForm = this.fb.group({
    city: [''], // On peut laisser vide par défaut ou 'Paris'
    startDate: [''],
    endDate: [''],
  }, {
    // On ajoute un validateur personnalisé au niveau du groupe
    validators: this.atLeastOneCriteriaValidator
  });

  // Logique de validation : Ville présente OU (Date Début ET Date Fin présentes)
  atLeastOneCriteriaValidator(group: AbstractControl): ValidationErrors | null {
    const city = group.get('city')?.value;
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    const hasCity = !!city;
    const hasDates = !!(start && end);

    return (hasCity || hasDates) ? null : { incompleteSearch: true };
  }

  today: string = new Date().toISOString().split('T')[0];

  onSearch() {
    if (this.searchForm.valid) {
      const criteria = this.searchForm.value;

      // Création propre des paramètres
      const queryParams: any = {};

      // 1. On nettoie la ville (trim) pour éviter les espaces invisibles
      if (criteria.city && criteria.city.trim() !== '') {
        queryParams.city = criteria.city.trim();
      }

      // 2. On ajoute les dates seulement si elles existent
      if (criteria.startDate) queryParams.startDate = criteria.startDate;
      if (criteria.endDate) queryParams.endDate = criteria.endDate;

      this.router.navigate(['/vehicle-list.html'], { queryParams });
    }
  }
}
