import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => alert(err.error || 'Registration failed')
      });
    }
  }
}
