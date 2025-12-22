import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // US-18: Role-based redirection
          if (res.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/vehicle-list']);
          }
        },
        error: () => alert('Invalid credentials')
      });
    }
  }
}
