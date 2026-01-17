import { DadosEndereco } from "../../pacientes/models/dados-endereco";

export interface UsuarioLogado {
  id: number;          // extraído do token JWT
  idPaciente: number;  // retornado pela API
  role: string;        // extraído do token JWT
  nome?: string;        // retornado pela API
  email?: string;       // retornado pela API
  telefone?: string;    // retornado pela API
  cpf?: string;         // retornado pela API
  endereco?: DadosEndereco; // retornado pela API
}
