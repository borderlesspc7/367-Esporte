import React from "react";
import type { ExecucaoFinanceiraData } from "../../../types/report";

interface FinanceiroReportProps {
  data: ExecucaoFinanceiraData;
  detalhado: boolean;
}

export const FinanceiroReport: React.FC<FinanceiroReportProps> = ({
  data,
  detalhado,
}) => {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getStatusClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      "Dentro do Limite": "status-dentro-limite",
      "Próximo do Limite": "status-proximo-limite",
      "Acima do Limite": "status-acima-limite",
    };
    return `rubrica-status ${statusMap[status] || ""}`;
  };

  const getProgressClass = (status: string): string => {
    if (status === "Acima do Limite") return "progress-fill danger";
    if (status === "Próximo do Limite") return "progress-fill warning";
    return "progress-fill success";
  };

  return (
    <div className="financeiro-report">
      <div className="report-section">
        <h3>Resumo Geral</h3>
        <div className="financial-summary">
          <div className="stat-card">
            <div className="stat-label">Valor Total Aprovado</div>
            <div className="stat-value">
              {formatCurrency(data.valorTotalAprovado)}
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Valor Total Executado</div>
            <div className="stat-value">
              {formatCurrency(data.valorTotalExecutado)}
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Percentual Executado</div>
            <div className="stat-value">
              {formatPercentage(data.percentualExecutado)}
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Detalhamento por Rubrica</h3>
        <div className="rubricas-list">
          {data.rubricas.map((rubrica, index) => (
            <div key={index} className="rubrica-card">
              <div className="rubrica-header">
                <h4>{rubrica.nome}</h4>
                <span className={getStatusClass(rubrica.status)}>
                  {rubrica.status}
                </span>
              </div>

              <div className="rubrica-values">
                <div className="value-item">
                  <div className="value-label">Valor Previsto</div>
                  <div className="value-amount">
                    {formatCurrency(rubrica.valorPrevisto)}
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-label">Valor Executado</div>
                  <div className="value-amount">
                    {formatCurrency(rubrica.valorExecutado)}
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-label">Percentual Executado</div>
                  <div className="value-amount">
                    {formatPercentage(rubrica.percentualExecutado)}
                  </div>
                </div>
              </div>

              <div style={{ padding: "0 1.25rem 1.25rem" }}>
                <div className="progress-bar">
                  <div
                    className={getProgressClass(rubrica.status)}
                    style={{
                      width: `${Math.min(rubrica.percentualExecutado, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {detalhado && rubrica.itens && rubrica.itens.length > 0 && (
                <div className="itens-detalhados">
                  <h5 style={{ marginBottom: "0.75rem", color: "#374151" }}>
                    Itens da Rubrica ({rubrica.itens.length})
                  </h5>
                  <div style={{ overflowX: "auto" }}>
                    <table className="itens-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Fornecedor</th>
                          <th>Previsto</th>
                          <th>Executado</th>
                          <th>NF</th>
                          <th>Data Despesa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rubrica.itens.map((item, itemIndex) => (
                          <tr key={itemIndex}>
                            <td>
                              <strong>{item.nome}</strong>
                            </td>
                            <td>{item.fornecedor}</td>
                            <td>{formatCurrency(item.valorPrevisto)}</td>
                            <td>{formatCurrency(item.valorExecutado)}</td>
                            <td>{item.numeroNF || "-"}</td>
                            <td>{formatDate(item.dataDespesa)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {data.rubricas.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#6b7280",
              }}
            >
              Nenhuma rubrica encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
