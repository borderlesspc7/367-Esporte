import React, { useState, useEffect } from "react";
import { projectService } from "../../services/projectService";
import type { Project } from "../../types/project";
import { ProjectForm } from "../Projects/ProjectForm/ProjectForm";
import { ProjectFilter } from "../Projects/Filter/ProjectFilter";
import type { ProjectFilters } from "../../types/project";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import "./Projects.css";

export const Projects: React.FC = () => {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    linha: "Todos",
    statusGeral: "Todos",
    municipio: "",
    periodoInicio: "",
    periodoFim: "",
    valorAprovadoMin: "",
    valorAprovadoMax: "",
    valorCaptadoMin: "",
    valorCaptadoMax: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projects = await projectService.getAll();
      setProjects(projects);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar projetos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setFormLoading(true);
      await projectService.create(project);
      await loadProjects();
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (
    project: Omit<Project, "createdAt" | "updatedAt">
  ) => {
    if (!editingProject?.id) return;
    try {
      setFormLoading(true);
      await projectService.update(editingProject.id, project);
      await loadProjects();
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar projeto"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      setDeleteLoading(id);
      await projectService.delete(id);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir projeto");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const formatDate = (date: Date | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredProjects = projects.filter((project) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        project.nome.toLowerCase().includes(searchLower) ||
        project.proponente.toLowerCase().includes(searchLower) ||
        project.municipio.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    if (filters.linha !== "Todos" && project.linha !== filters.linha) {
      return false;
    }

    if (
      filters.statusGeral !== "Todos" &&
      project.statusGeral !== filters.statusGeral
    ) {
      return false;
    }

    if (
      filters.municipio &&
      !project.municipio.toLowerCase().includes(filters.municipio.toLowerCase())
    ) {
      return false;
    }

    if (filters.periodoInicio) {
      const inicioDate =
        project.periodoExecucao.inicio instanceof Date
          ? project.periodoExecucao.inicio
          : new Date(project.periodoExecucao.inicio);
      const filterInicio = new Date(filters.periodoInicio);
      if (inicioDate < filterInicio) return false;
    }

    if (filters.periodoFim) {
      const fimDate =
        project.periodoExecucao.fim instanceof Date
          ? project.periodoExecucao.fim
          : new Date(project.periodoExecucao.fim);
      const filterFim = new Date(filters.periodoFim);
      if (fimDate > filterFim) return false;
    }

    if (filters.valorAprovadoMin) {
      const min = parseFloat(filters.valorAprovadoMin);
      if (!isNaN(min) && project.valorAprovado < min) return false;
    }

    if (filters.valorAprovadoMax) {
      const max = parseFloat(filters.valorAprovadoMax);
      if (!isNaN(max) && project.valorAprovado > max) return false;
    }

    if (filters.valorCaptadoMin) {
      const min = parseFloat(filters.valorCaptadoMin);
      if (!isNaN(min) && project.valorCaptado < min) return false;
    }

    if (filters.valorCaptadoMax) {
      const max = parseFloat(filters.valorCaptadoMax);
      if (!isNaN(max) && project.valorCaptado > max) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setFilters({
      search: "",
      linha: "Todos",
      statusGeral: "Todos",
      municipio: "",
      periodoInicio: "",
      periodoFim: "",
      valorAprovadoMin: "",
      valorAprovadoMax: "",
      valorCaptadoMin: "",
      valorCaptadoMax: "",
    });
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-content">
          <h1 className="projects-title">
            <Briefcase className="title-icon" size={32} />
            Projetos
          </h1>
          <p className="projects-subtitle">
            Gerencie todos os seus projetos esportivos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn-new-project"
          >
            <Plus size={20} />
            Novo Projeto
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {!showForm && (
        <ProjectFilter
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />
      )}

      {showForm ? (
        <div className="form-wrapper">
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Briefcase size={64} />
              </div>
              <h3>Nenhum projeto encontrado</h3>
              <p>Comece criando seu primeiro projeto esportivo</p>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="btn-new-project btn-large"
              >
                <Plus size={20} />
                Criar Primeiro Projeto
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div className="project-card" key={project.id}>
                  <div className="project-card-header">
                    <div className="project-header-top">
                      <span
                        className={`project-status project-status-${project.statusGeral
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {project.statusGeral}
                      </span>
                      <div className="project-card-actions">
                        <button
                          onClick={() => handleEdit(project)}
                          className="btn-icon btn-icon-edit"
                          title="Editar"
                          disabled={deleteLoading === project.id}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => project.id && handleDelete(project.id)}
                          className="btn-icon btn-icon-danger"
                          title="Excluir"
                          disabled={deleteLoading === project.id}
                        >
                          {deleteLoading === project.id ? (
                            <div className="spinner-small" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="project-card-title">{project.nome}</h3>
                    <div className="project-line-badge">{project.linha}</div>
                  </div>

                  <div className="project-card-body">
                    <div className="project-info-item">
                      <div className="info-icon">
                        <Calendar size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Período</span>
                        <span className="info-value">
                          {formatDate(project.periodoExecucao.inicio)} -{" "}
                          {formatDate(project.periodoExecucao.fim)}
                        </span>
                      </div>
                    </div>

                    <div className="project-info-item">
                      <div className="info-icon">
                        <User size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Proponente</span>
                        <span className="info-value">{project.proponente}</span>
                      </div>
                    </div>

                    <div className="project-info-item">
                      <div className="info-icon">
                        <MapPin size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Município</span>
                        <span className="info-value">{project.municipio}</span>
                      </div>
                    </div>

                    {project.patrocinadores.length > 0 && (
                      <div className="project-info-item">
                        <div className="info-icon">
                          <TrendingUp size={18} />
                        </div>
                        <div className="info-content">
                          <span className="info-label">Patrocinadores</span>
                          <span className="info-value">
                            {project.patrocinadores.join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="project-financial">
                      <div className="financial-item">
                        <div className="financial-icon approved">
                          <DollarSign size={20} />
                        </div>
                        <div className="financial-content">
                          <span className="financial-label">
                            Valor Aprovado
                          </span>
                          <span className="financial-value">
                            {formatCurrency(project.valorAprovado)}
                          </span>
                        </div>
                      </div>

                      <div className="financial-item">
                        <div className="financial-icon captured">
                          <DollarSign size={20} />
                        </div>
                        <div className="financial-content">
                          <span className="financial-label">Valor Captado</span>
                          <span className="financial-value">
                            {formatCurrency(project.valorCaptado)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="project-progress">
                      <div className="progress-info">
                        <span className="progress-label">
                          Progresso de Captação
                        </span>
                        <span className="progress-percentage">
                          {(
                            (project.valorCaptado / project.valorAprovado) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(
                              (project.valorCaptado / project.valorAprovado) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
