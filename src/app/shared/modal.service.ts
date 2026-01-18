import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiValidationError, ApiErrorResponse } from './api-error.model';


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

  // Tratamento genérico de erro vindo da API
  handleApiError(error: HttpErrorResponse): string {
    const err = error.error;

    // Caso seja array de validação
    if (Array.isArray(err)){
      return err
        .map((e: ApiValidationError) => e.mensagem)
        .join('\n');
    }
      
    // Caso seja objeto com message
    if (typeof err === 'object' && err?.message) {
      return (err as ApiErrorResponse).message!;
    } 

    // Caso seja string simples
    if (typeof err === 'string') {
      return err;
    }

     //Fallback
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }
  
}
