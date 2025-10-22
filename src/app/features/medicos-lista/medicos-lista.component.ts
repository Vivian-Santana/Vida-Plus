import { Component, OnInit } from '@angular/core';
import { MedicoService } from './medico.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicos-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicos-lista.component.html',
  styleUrl: './medicos-lista.component.css'
})
export class MedicosListaComponent implements OnInit {

  medicos: any[] = [];
  paginaAtual = 0;
  totalPaginas = 0;
  carregando = true;
  erro: string | null = null;

  constructor(private medicoService: MedicoService) {}

  ngOnInit() {
    this.carregarMedicos(0);
  }

  // Método que cria um array de páginas para o *ngFor
  paginasArray(): number[] {
    return Array(this.totalPaginas).fill(0).map((x, i) => i);
  }

  // Ir para página específica
  irParaPagina(pagina: number, event: Event): void {
    event.preventDefault(); // evita o reload da página
      if (pagina !== this.paginaAtual) {
      this.carregarMedicos(pagina);
    }
  }

  proximaPagina(event: Event): void {
    event.preventDefault();
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.carregarMedicos(this.paginaAtual + 1);
    }
  }

  paginaAnterior(event: Event): void {
    event.preventDefault();
    if (this.paginaAtual > 0) {
      this.carregarMedicos(this.paginaAtual - 1);
    }
  }

  carregarMedicos(pagina: number = 0): void {
    this.carregando = true;
    this.erro = null;

    this.medicoService.listar(pagina).subscribe({
      next: (res) => {
        this.medicos = res.content.map((m: any) => ({
          nome: m.nome,
          crm: m.crm,
          especialidade: m.especialidade
        }));
        this.paginaAtual = res.number;
        this.totalPaginas = res.totalPages;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao listar médicos:', err);
        this.erro = 'Não foi possível carregar a lista de médicos.';
        this.carregando = false;
      }
    });
  }

}
