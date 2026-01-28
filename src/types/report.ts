export type ReportType = 
  | "status_geral"
  | "metas"
  | "execucao_financeira"
  | "contrapartidas"
  | "midia"
  | "documentos";

export type ReportFormat = "pdf" | "visualizacao";

export type DetailLevel = "resumido" | "detalhado";

export interface ReportFilters {
  projectId: string;
  reportType: ReportType;
  format: ReportFormat;
  detailLevel: DetailLevel;
  dateStart?: Date;
  dateEnd?: Date;
  includeCharts?: boolean;
}

export interface StatusGeralData {
  nomeProjeito: string;
  linha: string;
  periodo: {
    inicio: Date;
    fim: Date;
  };
  statusGeral: string;
  valorAprovado: number;
  valorCaptado: number;
  percentualCaptado: number;
  valorExecutado: number;
  percentualExecutado: number;
  totalMetas: number;
  metasConcluidas: number;
  metasPendentes: number;
  metasAtrasadas: number;
  rubricasTotal: number;
  rubricasDentroLimite: number;
  rubricasProximoLimite: number;
  rubricasAcimaLimite: number;
}

export interface MetasReportData {
  total: number;
  concluidas: number;
  pendentes: number;
  atrasadas: number;
  canceladas: number;
  metas: {
    nome: string;
    dataLimite: Date;
    responsavel: string;
    status: string;
    sinaleira: string;
    documentosCount: number;
  }[];
}

export interface ExecucaoFinanceiraData {
  valorTotalAprovado: number;
  valorTotalExecutado: number;
  percentualExecutado: number;
  rubricas: {
    nome: string;
    valorPrevisto: number;
    valorExecutado: number;
    percentualExecutado: number;
    status: string;
    itens?: {
      nome: string;
      fornecedor: string;
      valorPrevisto: number;
      valorExecutado: number;
      numeroNF?: string;
      dataDespesa?: Date;
    }[];
  }[];
}

export interface ContrapartidasData {
  totalContrapartidas: number;
  contrapartidasRealizadas: number;
  contrapartidasPendentes: number;
  itens: {
    tipo: string;
    descricao: string;
    valor: number;
    status: string;
    dataRealizacao?: Date;
  }[];
}

export interface MidiaData {
  totalAcoes: number;
  acoesRealizadas: number;
  acoesPendentes: number;
  acoes: {
    tipo: string; // "Publicação", "Evento", "Campanha", etc.
    descricao: string;
    data: Date;
    alcance?: number;
    midiaUrl?: string;
    observacoes?: string;
  }[];
}

export interface DocumentosData {
  totalDocumentos: number;
  documentosLiberados: number;
  documentosPendentes: number;
  documentos: {
    tipo: string; // "NF", "Contrato", "Comprovante", "Relatório", etc.
    nome: string;
    status: string;
    dataEnvio?: Date;
    dataAprovacao?: Date;
    responsavel: string;
  }[];
}
