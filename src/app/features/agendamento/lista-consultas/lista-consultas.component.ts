import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../service/consulta.service';
import { Consulta } from '../models/consulta.model';

@Component({
  selector: 'app-lista-consultas',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista-consultas.component.html',
  styleUrl: './lista-consultas.component.css'
})
export class ListaConsultasComponent {

  consultas: Consulta[] = []; //armazena o array de cosultas agendadas
  carregando = false;
  erro: string | null = null;

    constructor(private consultaService: ConsultaService) {}

    ngOnInit(): void {
      this.carregarConsultas();
     }

      carregarConsultas() {
        this.carregando = true;
        this.erro = null;

      this.consultaService.listarMinhasConsultas().subscribe({
        next: (dados: Consulta[]) => {
          this.consultas = dados;
          this.carregando = false;
        },
        error: (err: any) => {
          console.error(err);
          this.erro = 'Erro ao carregar consultas';
          this.carregando = false;
        }
      });

    }
  }


