import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth-service';


export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // US-18: Check if user is logged in AND has the 'admin' role
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // If not, alert the user and redirect to login
  alert("Access Denied: Administrator privileges required.");
  router.navigate(['/login']);
  return false;
};
