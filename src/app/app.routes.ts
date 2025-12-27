import { Routes } from '@angular/router';
import {HomeComponent} from './Components/home-component/home-component';
import {VehicleList} from './Components/vehicle-list/vehicle-list';
import {AdminPanel} from './Components/admin-panel/admin-panel';
import {LoginComponent} from './Components/login-component/login-component';
import {RegisterComponent} from './Components/register-component/register-component';
import {adminGuard} from './guards/auth-guard';
import {VehicleDetailComponent} from './Components/vehicle-detail-component/vehicle-detail-component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path:'vehicle-list.html', component: VehicleList},
  { path: 'login.html', component: LoginComponent },
  { path: 'register.html', component: RegisterComponent },
  { path: 'vehicle.html/:id', component: VehicleDetailComponent },
  {
    path: 'admin.html',
    component: AdminPanel,
    canActivate: [adminGuard] // US-18: Protects the admin route
  },
  { path: '**', redirectTo: '' }
];

