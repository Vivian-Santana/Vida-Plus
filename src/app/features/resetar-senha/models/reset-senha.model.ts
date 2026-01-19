export interface ResetSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface ResetSenhaResponse {
  mensagem: string;
}
