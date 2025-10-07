// src/app/features/agendamento/agendamento-model/consulta.model.ts
// modelo de dados da feature de agendamento
export interface Consulta {
  id: number;
  data: string;
  nomeMedico: string;
  especialidade: string;
  motivoCancelamento: string;
}
