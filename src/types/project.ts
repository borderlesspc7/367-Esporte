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
  id?: string;
  nome: string;
  linha: ProjectLine;
  periodoExecucao: {
    inicio: Date;
    fim: Date;
  };
  proponente: string;
  municipio: string;
  patrocinadores: string[];
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
    inicio: string;
    fim: string;
  };
  proponente: string;
  municipio: string;
  patrocinadores: string;
  valorAprovado: string;
  valorCaptado: string;
  statusGeral: ProjectStatus;
}
