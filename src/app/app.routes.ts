import { Routes } from '@angular/router';
import {HomeComponent} from './Components/home-component/home-component';
import {VehicleList} from './Components/vehicle-list/vehicle-list';
import {AdminPanel} from './Components/admin-panel/admin-panel';
import {LoginComponent} from './Components/login-component/login-component';
import {RegisterComponent} from './Components/register-component/register-component';
import {adminGuard} from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path:'vehicle-list', component: VehicleList},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminPanel,
    canActivate: [adminGuard] // US-18: Protects the admin route
  },
  { path: '**', redirectTo: '' }
];

