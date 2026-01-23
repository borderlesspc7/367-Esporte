export interface Rubrica {
    id?: string;
    nome: string;
    descricao?: string;
    projetoId: string;
    limitePercentual?: number; // Percentual do valor total do projeto
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Fornecedor {
    id?: string;
    nome: string;
    cnpj: string;
    contato?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Item {
    id?: string;
    nome: string;
    descricao?: string;
    rubricaId: string;
    fornecedorId?: string;
    valorPrevisto: number;
    valorExecutado: number;
    dataDespesa?: Date;
    numeroNF?: string;
    comprovantesAnexados: string[]; // Array de URLs ou nomes de arquivos
    observacoes?: string;
    projetoId: string; // Para facilitar consultas
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Orcamento {
    id?: string;
    itemId: string;
    fornecedorId: string;
    valor: number;
    dataOrcamento: Date;
    validade?: Date;
    observacoes?: string;
    aprovado: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // Form Data Types
  export interface RubricaFormData {
    nome: string;
    descricao: string;
    limitePercentual: string;
  }
  
  export interface FornecedorFormData {
    nome: string;
    cnpj: string;
    contato: string;
    email: string;
    telefone: string;
    endereco: string;
  }
  
  export interface ItemFormData {
    nome: string;
    descricao: string;
    rubricaId: string;
    fornecedorId: string;
    valorPrevisto: string;
    valorExecutado: string;
    dataDespesa: string;
    numeroNF: string;
    comprovantesAnexados: string;
    observacoes: string;
  }
  
  export interface OrcamentoFormData {
    itemId: string;
    fornecedorId: string;
    valor: string;
    dataOrcamento: string;
    validade: string;
    observacoes: string;
    aprovado: boolean;
  }
  
  // Relatório Types
  export interface RelatorioExecucao {
    rubricaId: string;
    rubricaNome: string;
    valorPrevisto: number;
    valorExecutado: number;
    percentualExecutado: number;
    percentualLimite?: number;
    status: "dentro_limite" | "proximo_limite" | "acima_limite";
    itens: Item[];
  }