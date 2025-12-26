import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';
import {Vehicle} from '../models/vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  // US-11
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin`)
  }

  //US-8
  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(this.baseUrl, vehicle);
  }

  // US-10 : Modifier (Prix, etc.)
  updateVehicle(id: number, vehicle: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, vehicle);
  }

  // US-9 : Supprimer
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locations`);
  }

  /**
   * Récupère tous les véhicules disponibles.
   * Gère le tri par prix (US-05, US-06).
   */
  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }

  // Appelle [HttpGet("search")] du contrôleur C#
  searchVehicles(searchParams: any): Observable<Vehicle[]> {
    let params = new HttpParams();

    if (searchParams.city) params = params.set('city', searchParams.city);
    if (searchParams.startDate) params = params.set('start', searchParams.startDate);
    if (searchParams.endDate) params = params.set('end', searchParams.endDate);

    return this.http.get<Vehicle[]>(`${this.baseUrl}/search`, { params });
  }

}

