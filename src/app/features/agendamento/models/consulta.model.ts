// src/app/features/agendamento/models/consulta.model.ts
export interface Consulta {
  id: number;
  data: string;
  nomeMedico: string;
  especialidade: string;
  motivoCancelamento: string;
}
