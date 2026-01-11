
export interface UsuarioLogado {
  id: number;          // extraído do token JWT
  idPaciente: number;  // retornado pela API
  role: string;        // extraído do token JWT
  nome?: string;        // retornado pela API
  email?: string;       // retornado pela API
  telefone?: string;    // retornado pela API
  cpf?: string;         // retornado pela API
  endereco?: any;       // pode tipar depois se tiver um model para Endereco
}
