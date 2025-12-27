import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Pour lire l'URL et le lien retour
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-detail-component.html',
  styleUrls: ['./vehicle-detail-component.css']
})
export class VehicleDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);

  // Observable qui contiendra les données du véhicule
  vehicle$: Observable<Vehicle> | undefined;

  ngOnInit(): void {
    // On écoute l'ID dans l'URL. Si l'ID change, on recharge le véhicule.
    this.vehicle$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.vehicleService.getById(id);
      })
    );
  }

}
