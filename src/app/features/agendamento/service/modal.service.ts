import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  mostrarModalSucesso = false;
  mostrarModalErro = false;
  mensagemModal = '';

  constructor() {}

  // Modal de sucesso
  abrirModalSucesso(mensagem: string): void {
    this.mensagemModal = mensagem;
    this.mostrarModalSucesso = true;
    this.mostrarModalErro = false;

    setTimeout(() => this.mostrarModalSucesso = false, 5000);
  }

  // Modal de erro
  abrirModalErro(mensagem: string): void {
    this.mensagemModal = mensagem;
    this.mostrarModalErro = true;

    setTimeout(() => this.mostrarModalErro = false, 4000);
  }

  // 💡 Tratamento genérico de erro vindo da API
  handleApiError(err: any): string {
    let mensagemErro = 'Ocorreu um erro.';

    // Caso seja array de validação
    if (Array.isArray(err.error) && err.error.length > 0) {
      mensagemErro = err.error.map((e: any) => e.mensagem).join('\n');
    } 
    // Caso seja objeto com message
    else if (err.error && err.error.message) {
      mensagemErro = err.error.message;
    } 
    // Caso seja string simples
    else if (typeof err.error === 'string') {
      mensagemErro = err.error;
    }

    return mensagemErro;
  }
  
}
