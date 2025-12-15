import React, { useState, useEffect } from "react";
import type {
  Project,
  ProjectFormData,
  ProjectLine,
  ProjectStatus,
} from "../../../types/project";
import "./ProjectForm.css";

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PROJECT_LINES: ProjectLine[] = [
  "Educacional",
  "Rendimento",
  "Participação",
  "Outros",
];
const PROJECT_STATUSES: ProjectStatus[] = [
  "Em planejamento",
  "Em execução",
  "Concluído",
  "Cancelado",
  "Pausado",
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    nome: "",
    linha: "Educacional",
    periodoExecucao: {
      inicio: "",
      fim: "",
    },
    proponente: "",
    municipio: "",
    patrocinadores: "",
    valorAprovado: "0",
    valorCaptado: "0",
    statusGeral: "Em planejamento",
  });

  const [error, setError] = useState<string | null>(null);

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (project) {
      const inicioDate =
        project.periodoExecucao.inicio instanceof Date
          ? project.periodoExecucao.inicio
          : new Date(project.periodoExecucao.inicio);
      const fimDate =
        project.periodoExecucao.fim instanceof Date
          ? project.periodoExecucao.fim
          : new Date(project.periodoExecucao.fim);

      setFormData({
        nome: project.nome,
        linha: project.linha,
        periodoExecucao: {
          inicio: inicioDate.toISOString().split("T")[0],
          fim: fimDate.toISOString().split("T")[0],
        },
        proponente: project.proponente,
        municipio: project.municipio,
        patrocinadores: project.patrocinadores.join(", "),
        valorAprovado: project.valorAprovado.toString(),
        valorCaptado: project.valorCaptado.toString(),
        statusGeral: project.statusGeral,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!formData.nome.trim()) {
      setError("O nome do projeto é obrigatório");
      return;
    }

    if (!formData.periodoExecucao.inicio || !formData.periodoExecucao.fim) {
      setError("O período de execução é obrigatório");
      return;
    }

    const inicioDate = new Date(formData.periodoExecucao.inicio);
    const fimDate = new Date(formData.periodoExecucao.fim);

    if (inicioDate > fimDate) {
      setError("A data de início deve ser anterior à data de fim");
      return;
    }

    const valorAprovado = parseFloat(formData.valorAprovado);
    const valorCaptado = parseFloat(formData.valorCaptado);

    if (isNaN(valorAprovado) || valorAprovado < 0) {
      setError("O valor aprovado deve ser um número válido");
      return;
    }

    if (isNaN(valorCaptado) || valorCaptado < 0) {
      setError("O valor captado deve ser um número válido");
      return;
    }

    if (valorCaptado > valorAprovado) {
      setError("O valor captado não pode ser maior que o valor aprovado");
      return;
    }

    try {
      const patrocinadoresArray = formData.patrocinadores
        .split(",")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);

      await onSubmit({
        nome: formData.nome.trim(),
        linha: formData.linha,
        periodoExecucao: {
          inicio: inicioDate,
          fim: fimDate,
        },
        proponente: formData.proponente.trim(),
        municipio: formData.municipio.trim(),
        patrocinadores: patrocinadoresArray,
        valorAprovado: valorAprovado,
        valorCaptado: valorCaptado,
        statusGeral: formData.statusGeral,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar projeto");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "periodoExecucao.inicio" || name === "periodoExecucao.fim") {
      setFormData({
        ...formData,
        periodoExecucao: {
          ...formData.periodoExecucao,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="project-form-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h2 className="project-form-title">
          {project ? "Editar Projeto" : "Novo Projeto"}
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome do Projeto *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Digite o nome do projeto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linha" className="form-label">
              Linha *
            </label>
            <select
              id="linha"
              name="linha"
              value={formData.linha}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              {PROJECT_LINES.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="periodoExecucao.inicio" className="form-label">
              Data de Início *
            </label>
            <input
              type="date"
              id="periodoExecucao.inicio"
              name="periodoExecucao.inicio"
              value={formData.periodoExecucao.inicio}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="periodoExecucao.fim" className="form-label">
              Data de Fim *
            </label>
            <input
              type="date"
              id="periodoExecucao.fim"
              name="periodoExecucao.fim"
              value={formData.periodoExecucao.fim}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="proponente" className="form-label">
              Proponente *
            </label>
            <input
              type="text"
              id="proponente"
              name="proponente"
              value={formData.proponente}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Digite o nome do proponente"
            />
          </div>

          <div className="form-group">
            <label htmlFor="municipio" className="form-label">
              Município *
            </label>
            <input
              type="text"
              id="municipio"
              name="municipio"
              value={formData.municipio}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Digite o município"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="patrocinadores" className="form-label">
            Patrocinadores
          </label>
          <input
            type="text"
            id="patrocinadores"
            name="patrocinadores"
            value={formData.patrocinadores}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Separe múltiplos patrocinadores por vírgula"
          />
          <small className="form-hint">
            Exemplo: Empresa A, Empresa B, Empresa C
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="valorAprovado" className="form-label">
              Valor Aprovado (R$) *
            </label>
            <input
              type="number"
              id="valorAprovado"
              name="valorAprovado"
              value={formData.valorAprovado}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              disabled={loading}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="valorCaptado" className="form-label">
              Valor Captado (R$) *
            </label>
            <input
              type="number"
              id="valorCaptado"
              name="valorCaptado"
              value={formData.valorCaptado}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              disabled={loading}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="statusGeral" className="form-label">
            Status Geral *
          </label>
          <select
            id="statusGeral"
            name="statusGeral"
            value={formData.statusGeral}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Salvando..." : project ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};
