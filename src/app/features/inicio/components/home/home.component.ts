import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardConsultasComponent } from "./../../cards/card-consultas/card-consultas.component";
import { CardAgendarConsultaComponent } from './../../cards/card-agendar-consulta/card-agendar-consulta.component';
import { CardMedicosComponent } from "./../../cards/card-medicos/card-medicos.component";
import { CardAtualizarComponent } from "./../../cards/card-atualizar/card-atualizar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CardConsultasComponent, CardAgendarConsultaComponent,
    CardMedicosComponent, CardAtualizarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
