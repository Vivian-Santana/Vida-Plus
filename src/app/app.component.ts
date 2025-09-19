import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./features/login/login.component";
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public router: Router) {}

  title = 'vidaPlus';

  mostrarNavbar(): boolean {
    return !this.router.url.startsWith('/login') && !this.router.url.startsWith('/reset-senha');
  }
}
