export interface AgendamentoConsulta{
  medicoId: number;
  data: string;
  horario: string;
  pacienteId?: number;
}