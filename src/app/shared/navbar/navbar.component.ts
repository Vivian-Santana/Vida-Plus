import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  
  logout() {
    // limpa localStorage e memória
    this.authService.logout(); 

    // redireciona para login
    this.router.navigate(['/login']);
  }
}
