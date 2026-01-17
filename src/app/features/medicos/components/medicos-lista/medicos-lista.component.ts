import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../medicos/services/medico.service';
import { CommonModule } from '@angular/common';
import { Medico } from '../../models/medico.model';
import { Subject, takeUntil } from 'rxjs';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-medicos-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicos-lista.component.html',
  styleUrl: './medicos-lista.component.css'
})
export class MedicosListaComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  paginaAtual = 0;
  totalPaginas = 0;
  paginas: number[] = [];

  carregando = true;
  erro: string | null = null;

  private readonly destroy$ = new Subject<void>();
  
  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void{
    this.carregarMedicos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    this.medicoService
      .listar(pagina)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Page<Medico>) => {
          this.medicos = res.content;
          this.paginaAtual = res.number;
          this.totalPaginas = res.totalPages;
          //cria array de páginas
          this.paginas = Array.from(
            { length: res.totalPages }, 
            (_, i) => i);             
          this.carregando = false;
        },

      error: (err) => {
        console.error('Erro ao listar médicos:', err);
        this.erro = 'Não foi possível carregar a lista de médicos.';
        this.carregando = false;
      }
    });
  }
  // reutiliza elementos que ja estão no Dom, reconhece pelo id, evitando re-renderizações desnecessárias.
    trackByMedico(_: number, medico: Medico): number {
    return medico.id;
  }

}
