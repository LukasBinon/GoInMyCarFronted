import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/account`;

  // Signals for reactive UI updates
  // We initialize from localStorage to maintain session after page refresh
  currentUserRole = signal<string | null>(localStorage.getItem('user_role'));

  /**
   * US-17: Register a new user
   * Sends fullName, email, and password to the backend
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  /**
   * US-18: Authenticate user and store credentials
   * On success, saves JWT and Role to localStorage
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        // Store technical data for future requests and session persistence
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_role', response.role);

        // Update the signal to notify the UI (e.g., Navbar changes)
        this.currentUserRole.set(response.role);
      })
    );
  }

  /**
   * US-19: Logout and clear session
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    this.currentUserRole.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Utility to check if a token exists
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * US-18 Helper: Check if the current user is an Administrator
   */
  isAdmin(): boolean {
    return this.currentUserRole() === 'admin';
  }

  /**
   * Optional: Get the raw token for HttpInterceptors
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
