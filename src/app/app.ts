import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from './Components/home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [ HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('GoInMyCar');
}
