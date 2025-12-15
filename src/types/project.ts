export type ProjectLine =
  | "Educacional"
  | "Rendimento"
  | "Participação"
  | "Outros";

export type ProjectStatus =
  | "Em planejamento"
  | "Em execução"
  | "Concluído"
  | "Cancelado"
  | "Pausado";

export interface Project {
  id?: string; // ID do documento no Firestore
  nome: string;
  linha: ProjectLine;
  periodoExecucao: {
    inicio: Date;
    fim: Date;
  };
  proponente: string;
  municipio: string;
  patrocinadores: string[]; // Array de nomes de patrocinadores
  valorAprovado: number;
  valorCaptado: number;
  statusGeral: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectFormData {
  nome: string;
  linha: ProjectLine;
  periodoExecucao: {
    inicio: string; // Para inputs do tipo date
    fim: string;
  };
  proponente: string;
  municipio: string;
  patrocinadores: string; // String separada por vírgulas para o input
  valorAprovado: string; // String para facilitar input
  valorCaptado: string;
  statusGeral: ProjectStatus;
}
