import { DadosEndereco } from './dados-endereco';

export interface DadosAtualizacaoPaciente {
  id: number;
  nome: string;
  telefone: string;
  endereco: DadosEndereco;
}