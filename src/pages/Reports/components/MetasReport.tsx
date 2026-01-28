import React from "react";
import type { MetasReportData } from "../../../types/report";

interface MetasReportProps {
  data: MetasReportData;
}

export const MetasReport: React.FC<MetasReportProps> = ({ data }) => {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getSinaleiraClass = (sinaleira: string): string => {
    return `sinaleira-badge sinaleira-${sinaleira}`;
  };

  const getStatusClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      Concluída: "status-concluida",
      "Em andamento": "status-andamento",
      "Não iniciada": "status-nao-iniciada",
      Atrasada: "status-atrasada",
      Cancelada: "status-cancelada",
    };
    return `status-badge ${statusMap[status] || ""}`;
  };

  const getSinaleiraLabel = (sinaleira: string): string => {
    const labels: Record<string, string> = {
      verde: "V",
      amarelo: "A",
      vermelho: "V",
      azul: "C",
    };
    return labels[sinaleira] || "?";
  };

  return (
    <div className="metas-report">
      <div className="report-section">
        <h3>Resumo Geral</h3>
        <div className="metas-summary">
          <div className="summary-card" style={{ background: "#e0f2fe", color: "#0369a1" }}>
            <div className="summary-value">{data.total}</div>
            <div className="summary-label">Total</div>
          </div>
          <div className="summary-card" style={{ background: "#d1fae5", color: "#065f46" }}>
            <div className="summary-value">{data.concluidas}</div>
            <div className="summary-label">Concluídas</div>
          </div>
          <div className="summary-card" style={{ background: "#dbeafe", color: "#1e40af" }}>
            <div className="summary-value">{data.pendentes}</div>
            <div className="summary-label">Pendentes</div>
          </div>
          <div className="summary-card" style={{ background: "#fee2e2", color: "#991b1b" }}>
            <div className="summary-value">{data.atrasadas}</div>
            <div className="summary-label">Atrasadas</div>
          </div>
          <div className="summary-card" style={{ background: "#f3f4f6", color: "#6b7280" }}>
            <div className="summary-value">{data.canceladas}</div>
            <div className="summary-label">Canceladas</div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Detalhamento das Metas</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="metas-table">
            <thead>
              <tr>
                <th>Meta</th>
                <th>Data Limite</th>
                <th>Responsável</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Sinaleira</th>
                <th style={{ textAlign: "center" }}>Documentos</th>
              </tr>
            </thead>
            <tbody>
              {data.metas.map((meta, index) => (
                <tr key={index}>
                  <td>
                    <strong>{meta.nome}</strong>
                  </td>
                  <td>{formatDate(meta.dataLimite)}</td>
                  <td>{meta.responsavel}</td>
                  <td>
                    <span className={getStatusClass(meta.status)}>
                      {meta.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      className={getSinaleiraClass(meta.sinaleira)}
                      title={meta.sinaleira}
                    >
                      {getSinaleiraLabel(meta.sinaleira)}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {meta.documentosCount > 0 ? (
                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#1e40af",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {meta.documentosCount}
                      </span>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
              {data.metas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>
                    Nenhuma meta encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
