import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";
import "./Dashboard.css";
import { projectService } from "../../services/projectService";
import { goalService } from "../../services/goalService";
import { relatorioService } from "../../services/relatorioService";
import type { Project } from "../../types/project";
import type { Goal } from "../../types/goal";
import { calcularSinaleira } from "../../types/goal";

interface DashboardStats {
  totalProjetos: number;
  projetosEmExecucao: number;
  projetosConcluidos: number;
  valorTotalAprovado: number;
  valorTotalCaptado: number;
  valorTotalExecutado: number;
}

interface ProjetoComMetricas extends Project {
  percentualFisico: number;
  percentualFinanceiro: number;
  totalMetas: number;
  metasConcluidas: number;
  valorExecutado: number;
}

interface MetaProxima extends Goal {
  projetoNome: string;
  diasRestantes: number;
  sinaleira: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalProjetos: 0,
    projetosEmExecucao: 0,
    projetosConcluidos: 0,
    valorTotalAprovado: 0,
    valorTotalCaptado: 0,
    valorTotalExecutado: 0,
  });

  const [projetos, setProjetos] = useState<ProjetoComMetricas[]>([]);
  const [proximasMetas, setProximasMetas] = useState<MetaProxima[]>([]);
  const [ultimosDocumentos, setUltimosDocumentos] = useState<
    { nome: string; projeto: string; data: Date; tipo: string }[]
  >([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar projetos
      const projectsList = await projectService.getAll();

      // Calcular estatísticas gerais
      const statsData: DashboardStats = {
        totalProjetos: projectsList.length,
        projetosEmExecucao: projectsList.filter(
          (p) => p.statusGeral === "Em execução",
        ).length,
        projetosConcluidos: projectsList.filter(
          (p) => p.statusGeral === "Concluído",
        ).length,
        valorTotalAprovado: projectsList.reduce(
          (sum, p) => sum + p.valorAprovado,
          0,
        ),
        valorTotalCaptado: projectsList.reduce(
          (sum, p) => sum + p.valorCaptado,
          0,
        ),
        valorTotalExecutado: 0,
      };

      // Carregar métricas de cada projeto
      const projetosComMetricas: ProjetoComMetricas[] = await Promise.all(
        projectsList.map(async (projeto) => {
          try {
            // Buscar metas do projeto
            const metas = await goalService.getByProjectId(projeto.id!);
            const metasConcluidas = metas.filter(
              (m) => m.status === "Concluída",
            ).length;
            const percentualFisico =
              metas.length > 0 ? (metasConcluidas / metas.length) * 100 : 0;

            // Buscar dados financeiros
            const relatoriosFinanceiros =
              await relatorioService.gerarRelatorioExecucao(projeto.id!);
            const valorExecutado = relatoriosFinanceiros.reduce(
              (sum, r) => sum + r.valorExecutado,
              0,
            );
            const percentualFinanceiro =
              projeto.valorCaptado > 0
                ? (valorExecutado / projeto.valorCaptado) * 100
                : 0;

            return {
              ...projeto,
              percentualFisico,
              percentualFinanceiro,
              totalMetas: metas.length,
              metasConcluidas,
              valorExecutado,
            };
          } catch (err) {
            return {
              ...projeto,
              percentualFisico: 0,
              percentualFinanceiro: 0,
              totalMetas: 0,
              metasConcluidas: 0,
              valorExecutado: 0,
            };
          }
        }),
      );

      statsData.valorTotalExecutado = projetosComMetricas.reduce(
        (sum, p) => sum + p.valorExecutado,
        0,
      );

      // Carregar próximas metas (próximos 30 dias)
      const todasMetas: MetaProxima[] = [];
      for (const projeto of projectsList) {
        try {
          const metas = await goalService.getByProjectId(projeto.id!);
          const metasProximas = metas
            .filter((meta) => {
              if (meta.status === "Concluída" || meta.status === "Cancelada")
                return false;
              const hoje = new Date();
              const dataLimite = new Date(meta.dataLimite);
              const diffTime = dataLimite.getTime() - hoje.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && diffDays <= 30;
            })
            .map((meta) => {
              const hoje = new Date();
              const dataLimite = new Date(meta.dataLimite);
              const diffTime = dataLimite.getTime() - hoje.getTime();
              const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return {
                ...meta,
                projetoNome: projeto.nome,
                diasRestantes,
                sinaleira: calcularSinaleira(meta.dataLimite, meta.status),
              };
            });
          todasMetas.push(...metasProximas);
        } catch (err) {
          console.error(`Erro ao carregar metas do projeto ${projeto.nome}`);
        }
      }

      // Ordenar por data mais próxima e pegar as 5 primeiras
      todasMetas.sort((a, b) => a.diasRestantes - b.diasRestantes);
      setProximasMetas(todasMetas.slice(0, 5));

      // Simular últimos documentos (em produção, viria de um serviço)
      const docs: typeof ultimosDocumentos = [];
      for (const projeto of projectsList.slice(0, 5)) {
        try {
          const metas = await goalService.getByProjectId(projeto.id!);
          const metasComDocs = metas.filter(
            (m) => m.documentosAnexos.length > 0,
          );
          metasComDocs.forEach((meta) => {
            meta.documentosAnexos.forEach((doc) => {
              docs.push({
                nome: doc,
                projeto: projeto.nome,
                data: meta.updatedAt || new Date(),
                tipo: "Meta Física",
              });
            });
          });
        } catch (err) {
          // Ignorar erros
        }
      }
      docs.sort((a, b) => b.data.getTime() - a.data.getTime());
      setUltimosDocumentos(docs.slice(0, 5));

      setStats(statsData);
      setProjetos(projetosComMetricas);
    } catch (err) {
      setError(`Erro ao carregar dados do dashboard: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getSinaleiraClass = (sinaleira: string): string => {
    return `sinaleira-badge sinaleira-${sinaleira}`;
  };

  const getSinaleiraIcon = (sinaleira: string) => {
    if (sinaleira === "verde") return <CheckCircle2 size={14} />;
    if (sinaleira === "amarelo") return <Clock size={14} />;
    if (sinaleira === "vermelho") return <AlertCircle size={14} />;
    return <CheckCircle2 size={14} />;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">
          <AlertCircle size={20} />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <LayoutDashboard size={28} />
            Dashboard Principal
          </h1>
          <p className="dashboard-subtitle">
            Visão geral de todos os projetos e indicadores
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FolderKanban size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProjetos}</div>
            <div className="stat-label">Total de Projetos</div>
            <div className="stat-detail">
              {stats.projetosEmExecucao} em execução
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.projetosConcluidos}</div>
            <div className="stat-label">Projetos Concluídos</div>
            <div className="stat-detail">
              {stats.totalProjetos > 0
                ? (
                    (stats.projetosConcluidos / stats.totalProjetos) *
                    100
                  ).toFixed(1)
                : 0}
              % do total
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {formatCurrency(stats.valorTotalCaptado)}
            </div>
            <div className="stat-label">Valor Captado</div>
            <div className="stat-detail">
              de {formatCurrency(stats.valorTotalAprovado)}
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {formatCurrency(stats.valorTotalExecutado)}
            </div>
            <div className="stat-label">Valor Executado</div>
            <div className="stat-detail">
              {stats.valorTotalCaptado > 0
                ? (
                    (stats.valorTotalExecutado / stats.valorTotalCaptado) *
                    100
                  ).toFixed(1)
                : 0}
              % do captado
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="dashboard-grid">
        {/* Todos os Projetos */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>
              <FolderKanban size={20} />
              Todos os Projetos
            </h2>
          </div>
          <div className="section-content">
            {projetos.length === 0 ? (
              <div className="empty-message">
                Nenhum projeto cadastrado ainda
              </div>
            ) : (
              <div className="projetos-list">
                {projetos.map((projeto) => (
                  <div
                    key={projeto.id}
                    className="projeto-item"
                    onClick={() => navigate(`/projects/${projeto.id}/goals`)}
                  >
                    <div className="projeto-header">
                      <h3>{projeto.nome}</h3>
                      <span
                        className={`status-badge status-${projeto.statusGeral.toLowerCase().replace(" ", "-")}`}
                      >
                        {projeto.statusGeral}
                      </span>
                    </div>

                    <div className="projeto-metricas">
                      <div className="metrica-group">
                        <div className="metrica-label">
                          <Target size={14} />
                          Execução Física
                        </div>
                        <div className="metrica-value">
                          {projeto.percentualFisico.toFixed(1)}%
                        </div>
                        <div className="progress-bar small">
                          <div
                            className="progress-fill success"
                            style={{ width: `${projeto.percentualFisico}%` }}
                          ></div>
                        </div>
                        <div className="metrica-detail">
                          {projeto.metasConcluidas} de {projeto.totalMetas}{" "}
                          metas
                        </div>
                      </div>

                      <div className="metrica-group">
                        <div className="metrica-label">
                          <DollarSign size={14} />
                          Execução Financeira
                        </div>
                        <div className="metrica-value">
                          {projeto.percentualFinanceiro.toFixed(1)}%
                        </div>
                        <div className="progress-bar small">
                          <div
                            className="progress-fill warning"
                            style={{
                              width: `${projeto.percentualFinanceiro}%`,
                            }}
                          ></div>
                        </div>
                        <div className="metrica-detail">
                          {formatCurrency(projeto.valorExecutado)} de{" "}
                          {formatCurrency(projeto.valorCaptado)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Próximas Metas */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Calendar size={20} />
              Próximas Metas
            </h2>
          </div>
          <div className="section-content">
            {proximasMetas.length === 0 ? (
              <div className="empty-message">
                Nenhuma meta próxima nos próximos 30 dias
              </div>
            ) : (
              <div className="metas-list">
                {proximasMetas.map((meta) => (
                  <div key={meta.id} className="meta-item">
                    <div className="meta-header">
                      <span className={getSinaleiraClass(meta.sinaleira)}>
                        {getSinaleiraIcon(meta.sinaleira)}
                      </span>
                      <div className="meta-info">
                        <div className="meta-nome">{meta.nome}</div>
                        <div className="meta-projeto">{meta.projetoNome}</div>
                      </div>
                    </div>
                    <div className="meta-footer">
                      <span className="meta-dias">
                        {meta.diasRestantes === 0
                          ? "Hoje"
                          : meta.diasRestantes === 1
                            ? "Amanhã"
                            : `${meta.diasRestantes} dias`}
                      </span>
                      <span className="meta-data">
                        {formatDate(meta.dataLimite)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Últimos Documentos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <FileText size={20} />
              Últimos Documentos
            </h2>
          </div>
          <div className="section-content">
            {ultimosDocumentos.length === 0 ? (
              <div className="empty-message">
                Nenhum documento enviado recentemente
              </div>
            ) : (
              <div className="documentos-list">
                {ultimosDocumentos.map((doc, index) => (
                  <div key={index} className="documento-item">
                    <div className="documento-icon">
                      <FileText size={16} />
                    </div>
                    <div className="documento-info">
                      <div className="documento-nome">{doc.nome}</div>
                      <div className="documento-meta">
                        <span className="documento-projeto">{doc.projeto}</span>
                        <span className="documento-separator">•</span>
                        <span className="documento-tipo">{doc.tipo}</span>
                      </div>
                    </div>
                    <div className="documento-data">{formatDate(doc.data)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
