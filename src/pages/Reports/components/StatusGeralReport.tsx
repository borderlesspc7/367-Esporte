import React from "react";
import type { StatusGeralData } from "../../../types/report";

interface StatusGeralReportProps {
  data: StatusGeralData;
}

export const StatusGeralReport: React.FC<StatusGeralReportProps> = ({
  data,
}) => {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="status-geral-report">
      <div className="report-section">
        <h3>Informações do Projeto</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="label">Nome do Projeto</div>
            <div className="value">{data.nomeProjeito}</div>
          </div>
          <div className="info-item">
            <div className="label">Linha</div>
            <div className="value">{data.linha}</div>
          </div>
          <div className="info-item">
            <div className="label">Status Geral</div>
            <div className="value">{data.statusGeral}</div>
          </div>
          <div className="info-item">
            <div className="label">Período de Execução</div>
            <div className="value">
              {formatDate(data.periodo.inicio)} a {formatDate(data.periodo.fim)}
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Resumo Financeiro</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Valor Aprovado</div>
            <div className="stat-value">{formatCurrency(data.valorAprovado)}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Valor Captado</div>
            <div className="stat-value">
              {formatCurrency(data.valorCaptado)}
              <div style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                {formatPercentage(data.percentualCaptado)}
              </div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Valor Executado</div>
            <div className="stat-value">
              {formatCurrency(data.valorExecutado)}
              <div style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                {formatPercentage(data.percentualExecutado)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Resumo de Metas</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total de Metas</div>
            <div className="stat-value">{data.totalMetas}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Metas Concluídas</div>
            <div className="stat-value">{data.metasConcluidas}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Metas Pendentes</div>
            <div className="stat-value">{data.metasPendentes}</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-label">Metas Atrasadas</div>
            <div className="stat-value">{data.metasAtrasadas}</div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Situação das Rubricas</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total de Rubricas</div>
            <div className="stat-value">{data.rubricasTotal}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Dentro do Limite</div>
            <div className="stat-value">{data.rubricasDentroLimite}</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Próximo do Limite</div>
            <div className="stat-value">{data.rubricasProximoLimite}</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-label">Acima do Limite</div>
            <div className="stat-value">{data.rubricasAcimaLimite}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
