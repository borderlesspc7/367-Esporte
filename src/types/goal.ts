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

export type SinaleiraStatus = "verde" | "amarelo" | "vermelho" | "azul";

export const calcularSinaleira = (dataLimite: Date | string, status: GoalStatus): SinaleiraStatus => {
  if(status === "Concluída") {
    return "azul";
  }

  if(status === "Cancelada") {
    return "vermelho";
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const limite = dataLimite instanceof Date ? new Date(dataLimite) : new Date(dataLimite);
  limite.setHours(0, 0, 0, 0);

  const diffTime = limite.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if(diffDays < 0){
    return "vermelho";
  }

  if(diffDays <= 7){
    return "amarelo";
  }

  return "verde";
}
