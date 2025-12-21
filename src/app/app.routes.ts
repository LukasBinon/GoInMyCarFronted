import { Routes } from '@angular/router';
import {HomeComponent} from './Components/home-component/home-component';
import {VehicleList} from './Components/vehicle-list/vehicle-list';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path:'vehicle-list', component: VehicleList}
];

