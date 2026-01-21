import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardNavegacaoComponent } from '../../cards/card-navegacao/card-navegacao.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CardNavegacaoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
