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

  onSearch() {
    if (this.searchForm.valid) {
      const criteria = this.searchForm.value;
      // On filtre les valeurs vides avant d'envoyer les paramètres
      const queryParams = Object.fromEntries(
        Object.entries(criteria).filter(([_, v]) => v !== '')
      );

      this.router.navigate(['/vehicles'], { queryParams });
    }
  }
}
