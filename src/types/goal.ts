export type GoalStatus = 
  | "Não iniciada"
  | "Em andamento"
  | "Concluída"
  | "Atrasada"
  | "Cancelada";

export interface Goal {
  id?: string;
  nome: string;
  dataLimite: Date;
  responsavel: string;
  documentosAnexos: string[]; // Array de URLs ou nomes de arquivos
  status: GoalStatus;
  observacoes?: string;
  projetoId: string; // ID do projeto ao qual a meta pertence
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoalFormData {
  nome: string;
  dataLimite: string; // Para input do tipo date
  responsavel: string;
  documentosAnexos: string; // String separada por vírgulas para o input
  status: GoalStatus;
  observacoes: string;
}