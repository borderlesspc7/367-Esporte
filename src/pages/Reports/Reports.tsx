import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import "./Reports.css";
import { relatorioService } from "../../services/relatorioService";
import { pdfService } from "../../services/pdfService";
import { projectService } from "../../services/projectService";
import type {
  ReportType,
  ReportFormat,
  DetailLevel,
  StatusGeralData,
  MetasReportData,
  ExecucaoFinanceiraData,
} from "../../types/report";
import type { Project } from "../../types/project";

import { StatusGeralReport } from "./components/StatusGeralReport";
import { MetasReport } from "./components/MetasReport";
import { FinanceiroReport } from "./components/FinanceiroReport";

export const Reports: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("status_geral");
  const [format, setFormat] = useState<ReportFormat>("visualizacao");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("resumido");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos dados de relatórios
  const [statusGeralData, setStatusGeralData] =
    useState<StatusGeralData | null>(null);
  const [metasData, setMetasData] = useState<MetasReportData | null>(null);
  const [financeiroData, setFinanceiroData] =
    useState<ExecucaoFinanceiraData | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0) {
      setSelectedProject(projectIdFromUrl);
    }
  }, [projectIdFromUrl, projects]);

  const loadProjects = async () => {
    try {
      const projectsList = await projectService.getAll();
      setProjects(projectsList);
    } catch (err) {
      setError("Erro ao carregar projetos");
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedProject) {
      setError("Selecione um projeto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (reportType === "status_geral") {
        const data = await relatorioService.gerarRelatorioStatusGeral(
          selectedProject
        );
        setStatusGeralData(data);

        if (format === "pdf") {
          pdfService.gerarPDFStatusGeral(data);
          setStatusGeralData(null);
        }
      } else if (reportType === "metas") {
        const data = await relatorioService.gerarRelatorioMetas(
          selectedProject
        );
        setMetasData(data);

        if (format === "pdf") {
          pdfService.gerarPDFMetas(data);
          setMetasData(null);
        }
      } else if (reportType === "execucao_financeira") {
        const data = await relatorioService.gerarRelatorioExecucaoFinanceira(
          selectedProject,
          detailLevel === "detalhado"
        );
        setFinanceiroData(data);

        if (format === "pdf") {
          pdfService.gerarPDFExecucaoFinanceira(
            data,
            detailLevel === "detalhado"
          );
          setFinanceiroData(null);
        }
      } else {
        setError("Tipo de relatório em desenvolvimento");
      }
    } catch (err) {
      setError(`Erro ao gerar relatório: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (reportType === "status_geral" && statusGeralData) {
      pdfService.gerarPDFStatusGeral(statusGeralData);
    } else if (reportType === "metas" && metasData) {
      pdfService.gerarPDFMetas(metasData);
    } else if (reportType === "execucao_financeira" && financeiroData) {
      pdfService.gerarPDFExecucaoFinanceira(
        financeiroData,
        detailLevel === "detalhado"
      );
    }
  };

  const handleClear = () => {
    setStatusGeralData(null);
    setMetasData(null);
    setFinanceiroData(null);
    setError(null);
  };

  const hasData =
    statusGeralData !== null ||
    metasData !== null ||
    financeiroData !== null;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>
          <FileText size={28} />
          Relatórios Automáticos
        </h1>
        <p>Gere relatórios detalhados em PDF ou visualize diretamente na tela</p>
      </div>

      <div className="reports-controls">
        <h2>Configurações do Relatório</h2>
        
        <div className="controls-grid">
          <div className="control-group">
            <label htmlFor="project-select">Projeto *</label>
            <select
              id="project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="report-type-select">Tipo de Relatório *</label>
            <select
              id="report-type-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              disabled={loading}
            >
              <option value="status_geral">Status Geral</option>
              <option value="metas">Metas Físicas</option>
              <option value="execucao_financeira">Execução Financeira</option>
              <option value="contrapartidas" disabled>
                Contrapartidas (Em breve)
              </option>
              <option value="midia" disabled>
                Ações de Mídia (Em breve)
              </option>
              <option value="documentos" disabled>
                Documentos Liberados (Em breve)
              </option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="format-select">Formato *</label>
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as ReportFormat)}
              disabled={loading}
            >
              <option value="visualizacao">Visualização na Tela</option>
              <option value="pdf">Download PDF</option>
            </select>
          </div>

          {reportType === "execucao_financeira" && (
            <div className="control-group">
              <label htmlFor="detail-level-select">Nível de Detalhe</label>
              <select
                id="detail-level-select"
                value={detailLevel}
                onChange={(e) =>
                  setDetailLevel(e.target.value as DetailLevel)
                }
                disabled={loading}
              >
                <option value="resumido">Resumido</option>
                <option value="detalhado">Detalhado</option>
              </select>
            </div>
          )}
        </div>

        <div className="actions-row">
          <button
            className="btn-report btn-generate"
            onClick={handleGenerateReport}
            disabled={!selectedProject || loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner-icon" />
                Gerando...
              </>
            ) : format === "pdf" ? (
              <>
                <Download size={18} />
                Gerar e Baixar PDF
              </>
            ) : (
              <>
                <Eye size={18} />
                Visualizar Relatório
              </>
            )}
          </button>

          {hasData && format === "visualizacao" && (
            <button
              className="btn-report btn-pdf"
              onClick={handleExportPDF}
              disabled={loading}
            >
              <Download size={18} />
              Exportar como PDF
            </button>
          )}

          {hasData && (
            <button
              className="btn-report btn-clear"
              onClick={handleClear}
              disabled={loading}
            >
              Limpar Visualização
            </button>
          )}
        </div>
      </div>

      <div className="reports-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Gerando relatório...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="empty-state">
            <FileText size={64} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>Selecione as opções acima e clique em "Visualizar Relatório" para começar</p>
          </div>
        )}

        {!loading && !error && statusGeralData && (
          <StatusGeralReport data={statusGeralData} />
        )}

        {!loading && !error && metasData && <MetasReport data={metasData} />}

        {!loading && !error && financeiroData && (
          <FinanceiroReport
            data={financeiroData}
            detalhado={detailLevel === "detalhado"}
          />
        )}
      </div>
    </div>
  );
};
