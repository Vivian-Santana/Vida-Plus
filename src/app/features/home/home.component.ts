import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardConsultasComponent } from "../card-consultas/card-consultas.component";
import { CardAgendarConsultaComponent } from '../card-agendar-consulta/card-agendar-consulta.component';
import { CardMedicosComponent } from "../card-medicos/card-medicos.component";
import { CardAtualizarComponent } from "../card-atualizar/card-atualizar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CardConsultasComponent, CardAgendarConsultaComponent,
    CardMedicosComponent, CardMedicosComponent, CardAtualizarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
