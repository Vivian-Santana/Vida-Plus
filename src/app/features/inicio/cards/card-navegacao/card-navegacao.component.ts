import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-navegacao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card-navegacao.component.html',
  styleUrl: './card-navegacao.component.css'
})
export class CardNavegacaoComponent {

  @Input({ required: true })
  rota!: string;

  constructor(private readonly router: Router) {}

  navegar() {
    this.router.navigate([this.rota]);
  }

}
