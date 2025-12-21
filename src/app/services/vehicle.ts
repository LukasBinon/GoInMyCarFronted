import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locations`);
  }

}
