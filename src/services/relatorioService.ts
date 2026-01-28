import { rubricaService } from "./rubricaService";
import { itemService } from "./itemService";
import { goalService } from "./goalService";
import { projectService } from "./projectService";
import { fornecedorService } from "./fornecedorService";
import type { RelatorioExecucao } from "../types/financial";
import type {
  StatusGeralData,
  MetasReportData,
  ExecucaoFinanceiraData,
} from "../types/report";
import { calcularSinaleira } from "../types/goal";

export const relatorioService = {
  async gerarRelatorioExecucao(
    projectId: string
  ): Promise<RelatorioExecucao[]> {
    try {
      // Buscar todas as rubricas do projeto
      const rubricas = await rubricaService.getByProjectId(projectId);

      // Para cada rubrica, buscar itens e calcular totais
      const relatorios: RelatorioExecucao[] = await Promise.all(
        rubricas.map(async (rubrica) => {
          const itens = await itemService.getByRubricaId(rubrica.id!);

          const valorPrevisto = itens.reduce(
            (sum, item) => sum + item.valorPrevisto,
            0
          );
          const valorExecutado = itens.reduce(
            (sum, item) => sum + item.valorExecutado,
            0
          );

          const percentualExecutado =
            valorPrevisto > 0 ? (valorExecutado / valorPrevisto) * 100 : 0;

          // Determinar status baseado no limite percentual
          let status: "dentro_limite" | "proximo_limite" | "acima_limite" =
            "dentro_limite";

          if (rubrica.limitePercentual) {
            if (percentualExecutado > rubrica.limitePercentual) {
              status = "acima_limite";
            } else if (percentualExecutado >= rubrica.limitePercentual * 0.9) {
              status = "proximo_limite";
            }
          }

          return {
            rubricaId: rubrica.id!,
            rubricaNome: rubrica.nome,
            valorPrevisto,
            valorExecutado,
            percentualExecutado,
            percentualLimite: rubrica.limitePercentual,
            status,
            itens,
          };
        })
      );

      return relatorios;
    } catch (error) {
      throw new Error(`Erro ao gerar relatório: ${error}`);
    }
  },

  async gerarAlertas(projectId: string): Promise<string[]> {
    try {
      const relatorios = await this.gerarRelatorioExecucao(projectId);
      const alertas: string[] = [];

      relatorios.forEach((relatorio) => {
        if (relatorio.status === "acima_limite") {
          alertas.push(
            `⚠️ Rubrica "${relatorio.rubricaNome}" está acima do limite (${relatorio.percentualExecutado.toFixed(2)}% executado vs ${relatorio.percentualLimite}% limite)`
          );
        } else if (relatorio.status === "proximo_limite") {
          alertas.push(
            `⚠️ Rubrica "${relatorio.rubricaNome}" está próxima do limite (${relatorio.percentualExecutado.toFixed(2)}% executado vs ${relatorio.percentualLimite}% limite)`
          );
        }
      });

      return alertas;
    } catch (error) {
      throw new Error(`Erro ao gerar alertas: ${error}`);
    }
  },

  async gerarRelatorioStatusGeral(
    projectId: string
  ): Promise<StatusGeralData> {
    try {
      // Buscar dados do projeto
      const project = await projectService.getById(projectId);
      if (!project) {
        throw new Error("Projeto não encontrado");
      }

      // Buscar metas
      const metas = await goalService.getByProjectId(projectId);
      const metasConcluidas = metas.filter((m) => m.status === "Concluída")
        .length;
      const metasPendentes = metas.filter(
        (m) => m.status === "Não iniciada" || m.status === "Em andamento"
      ).length;
      const metasAtrasadas = metas.filter((m) => m.status === "Atrasada")
        .length;

      // Buscar dados financeiros
      const relatoriosFinanceiros = await this.gerarRelatorioExecucao(
        projectId
      );
      const valorExecutado = relatoriosFinanceiros.reduce(
        (sum, r) => sum + r.valorExecutado,
        0
      );
      const rubricasDentroLimite = relatoriosFinanceiros.filter(
        (r) => r.status === "dentro_limite"
      ).length;
      const rubricasProximoLimite = relatoriosFinanceiros.filter(
        (r) => r.status === "proximo_limite"
      ).length;
      const rubricasAcimaLimite = relatoriosFinanceiros.filter(
        (r) => r.status === "acima_limite"
      ).length;

      return {
        nomeProjeito: project.nome,
        linha: project.linha,
        periodo: {
          inicio: project.periodoExecucao.inicio,
          fim: project.periodoExecucao.fim,
        },
        statusGeral: project.statusGeral,
        valorAprovado: project.valorAprovado,
        valorCaptado: project.valorCaptado,
        percentualCaptado:
          project.valorAprovado > 0
            ? (project.valorCaptado / project.valorAprovado) * 100
            : 0,
        valorExecutado,
        percentualExecutado:
          project.valorCaptado > 0
            ? (valorExecutado / project.valorCaptado) * 100
            : 0,
        totalMetas: metas.length,
        metasConcluidas,
        metasPendentes,
        metasAtrasadas,
        rubricasTotal: relatoriosFinanceiros.length,
        rubricasDentroLimite,
        rubricasProximoLimite,
        rubricasAcimaLimite,
      };
    } catch (error) {
      throw new Error(`Erro ao gerar relatório de status geral: ${error}`);
    }
  },

  async gerarRelatorioMetas(projectId: string): Promise<MetasReportData> {
    try {
      const metas = await goalService.getByProjectId(projectId);

      const concluidas = metas.filter((m) => m.status === "Concluída").length;
      const pendentes = metas.filter(
        (m) => m.status === "Não iniciada" || m.status === "Em andamento"
      ).length;
      const atrasadas = metas.filter((m) => m.status === "Atrasada").length;
      const canceladas = metas.filter((m) => m.status === "Cancelada").length;

      const metasData = metas.map((meta) => ({
        nome: meta.nome,
        dataLimite: meta.dataLimite,
        responsavel: meta.responsavel,
        status: meta.status,
        sinaleira: calcularSinaleira(meta.dataLimite, meta.status),
        documentosCount: meta.documentosAnexos.length,
      }));

      return {
        total: metas.length,
        concluidas,
        pendentes,
        atrasadas,
        canceladas,
        metas: metasData,
      };
    } catch (error) {
      throw new Error(`Erro ao gerar relatório de metas: ${error}`);
    }
  },

  async gerarRelatorioExecucaoFinanceira(
    projectId: string,
    detalhado: boolean = false
  ): Promise<ExecucaoFinanceiraData> {
    try {
      const relatoriosExecucao = await this.gerarRelatorioExecucao(projectId);
      const fornecedores = await fornecedorService.getAll();

      const valorTotalAprovado = relatoriosExecucao.reduce(
        (sum, r) => sum + r.valorPrevisto,
        0
      );
      const valorTotalExecutado = relatoriosExecucao.reduce(
        (sum, r) => sum + r.valorExecutado,
        0
      );

      const rubricas = await Promise.all(
        relatoriosExecucao.map(async (rel) => {
          const rubricaData: ExecucaoFinanceiraData["rubricas"][0] = {
            nome: rel.rubricaNome,
            valorPrevisto: rel.valorPrevisto,
            valorExecutado: rel.valorExecutado,
            percentualExecutado: rel.percentualExecutado,
            status:
              rel.status === "dentro_limite"
                ? "Dentro do Limite"
                : rel.status === "proximo_limite"
                ? "Próximo do Limite"
                : "Acima do Limite",
          };

          if (detalhado) {
            rubricaData.itens = rel.itens.map((item) => {
              const fornecedor = fornecedores.find(
                (f) => f.id === item.fornecedorId
              );
              return {
                nome: item.nome,
                fornecedor: fornecedor?.nome || "Não especificado",
                valorPrevisto: item.valorPrevisto,
                valorExecutado: item.valorExecutado,
                numeroNF: item.numeroNF,
                dataDespesa: item.dataDespesa,
              };
            });
          }

          return rubricaData;
        })
      );

      return {
        valorTotalAprovado,
        valorTotalExecutado,
        percentualExecutado:
          valorTotalAprovado > 0
            ? (valorTotalExecutado / valorTotalAprovado) * 100
            : 0,
        rubricas,
      };
    } catch (error) {
      throw new Error(
        `Erro ao gerar relatório de execução financeira: ${error}`
      );
    }
  },
};