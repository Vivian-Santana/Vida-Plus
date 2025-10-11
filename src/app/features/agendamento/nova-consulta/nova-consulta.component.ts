import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModalService } from '../service/modal.service';
import { AlertModalComponent } from '../../../shared/alert-modal/alert-modal.component';
import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-nova-consulta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AlertModalComponent],
  templateUrl: './nova-consulta.component.html',
  styleUrl: './nova-consulta.component.css'
})
export class NovaConsultaComponent {

  consultaForm!: FormGroup;
  idPaciente!: number;
  usuarioCarregado = false;

  medicos: any;

  medico: Medico[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private modalService: ModalService,
  ) {
    this.consultaForm = this.fb.group({
      nomeMedico: [null, Validators.required], // opcional
      data: ['', Validators.required],
      especialidade: ['', Validators.required]
    });
  }

  //CARREGA O USUÁRIO ASSIM QUE O COMPONENTE INICIA
  ngOnInit(): void {
    this.authService.carregarUsuarioLogado().subscribe(usuario => {
      if (usuario) {
        this.idPaciente = usuario.idPaciente;
        this.usuarioCarregado = true;
        console.log('idPaciente carregado:', this.idPaciente); //debug
      } else {
        console.error('Erro: idPaciente não carregado');
      }
    });

    // chama o método para buscar médicos
    this.carregarMedicos();
  }
  
  // método que busca os médicos na API
  carregarMedicos(): void {
    this.http.get<{content: Medico[]}>('http://localhost:8080/medicos')
      .subscribe({
        next: (resposta) => this.medicos =  resposta.content,
        //console.log('Médicos carregados:', this.medicos), // debug
        error: () => this.modalService.abrirModalErro('Erro ao carregar médicos.') 
      });
  }

  agendar() {

    if (!this.consultaForm.valid) {
      console.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.idPaciente) {
      console.error('Erro interno: idPaciente não carregado.');
      return;
    }

    const payload = {
      nomeMedico: this.consultaForm.value.nomeMedico,
      data: this.consultaForm.value.data,
      especialidade: this.consultaForm.value.especialidade,
      idPaciente: this.idPaciente // <<--- idPaciente preenchido vem do ngOnInit
    };

    this.http.post('http://localhost:8080/consultas/agendar-por-nome-medico', payload)
      .subscribe({
        next: () => {
          this.modalService.abrirModalSucesso('Consulta agendada com sucesso!');
          this.consultaForm.reset();
        },
        error: (err) => {
          // Extrai a mensagem automaticamente
          const mensagem = this.modalService.handleApiError(err);

          // tratamento especial (dia ou horário fora do expediente)
          if (mensagem.includes('já possui outra consulta')) {
            this.modalService.abrirModalErro ('O médico já possui outra consulta agendada nesse mesmo horário.');
          } else if (/horário|funcionamento|18:59/.test(mensagem.toLowerCase())) {
            this.modalService.abrirModalErro('O horário selecionado está fora do funcionamento da clínica (seg - sab. das 7:00 às 18:59).');
          }else {
            this.modalService.abrirModalErro(mensagem);
          }
        }
      });
  }

}
