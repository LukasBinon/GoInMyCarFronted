import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HomeComponent} from './Components/home-component/home-component';
import {AuthService} from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [ RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GoInMyCar');
  public authService = inject(AuthService);
}
