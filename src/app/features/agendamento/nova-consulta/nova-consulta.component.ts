import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nova-consulta',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './nova-consulta.component.html',
  styleUrl: './nova-consulta.component.css'
})
export class NovaConsultaComponent {

  consultaForm!: FormGroup;
  idPaciente!: number;
  usuarioCarregado = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private http: HttpClient,
  ) {

    this.consultaForm = this.fb.group({
      idMedico: [null, Validators.required], // opcional
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
  }

    agendar() {
      if (!this.consultaForm.valid) {
        console.warn('Formulário inválido');
        return;
      }

      if (!this.idPaciente) {
        console.error('Erro: idPaciente não carregado.');
        return;
      }

      const payload = {
      idMedico: this.consultaForm.value.idMedico,
      data: this.consultaForm.value.data,
      especialidade: this.consultaForm.value.especialidade,
      idPaciente: this.idPaciente // <<--- idPaciente preenchido vem do ngOnInit
    };  

      this.http.post('http://localhost:8080/consultas', payload)
        .subscribe({
          next: () => {
             alert('Consulta agendada com sucesso! ✅');
          },

          error: (err) => {
            console.error('Erro ao agendar', err);
            alert(' Erro ao agendar a consulta. Tente novamente. ❌');
          }
        });
    }

  }
