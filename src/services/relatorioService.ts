import { rubricaService } from "./rubricaService";
import { itemService } from "./itemService";
import type { RelatorioExecucao } from "../types/financial";

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
};