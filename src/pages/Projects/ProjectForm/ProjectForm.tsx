import React, { useState, useEffect, useMemo } from "react";
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

const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
};

const unformatCurrency = (value: string): string => {
  if (!value || value.trim() === "") return "0";

  let cleaned = value.replace(/[^\d,.]/g, "");

  if (!cleaned.match(/\d/)) return "0";

  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
    }
  }

  const numValue = parseFloat(cleaned);
  return isNaN(numValue) || numValue < 0 ? "0" : numValue.toString();
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const initialFormData = useMemo<ProjectFormData>(() => {
    if (!project) {
      return {
        nome: "",
        linha: "Educacional",
        periodoExecucao: {
          inicio: "",
          fim: "",
        },
        proponente: "",
        municipio: "",
        patrocinadores: "",
        valorAprovado: formatCurrency("0"),
        valorCaptado: formatCurrency("0"),
        statusGeral: "Em planejamento",
      };
    }

    const inicioDate =
      project.periodoExecucao.inicio instanceof Date
        ? project.periodoExecucao.inicio
        : new Date(project.periodoExecucao.inicio);
    const fimDate =
      project.periodoExecucao.fim instanceof Date
        ? project.periodoExecucao.fim
        : new Date(project.periodoExecucao.fim);

    return {
      nome: project.nome,
      linha: project.linha,
      periodoExecucao: {
        inicio: inicioDate.toISOString().split("T")[0],
        fim: fimDate.toISOString().split("T")[0],
      },
      proponente: project.proponente,
      municipio: project.municipio,
      patrocinadores: project.patrocinadores.join(", "),
      valorAprovado: formatCurrency(project.valorAprovado),
      valorCaptado: formatCurrency(project.valorCaptado),
      statusGeral: project.statusGeral,
    };
  }, [project?.id]);

  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

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

    const valorAprovado = parseFloat(unformatCurrency(formData.valorAprovado));
    const valorCaptado = parseFloat(unformatCurrency(formData.valorCaptado));

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
    } else if (name === "valorAprovado" || name === "valorCaptado") {
      // Aplica máscara monetária
      const unformatted = unformatCurrency(value);
      const formatted = formatCurrency(unformatted);
      setFormData({ ...formData, [name]: formatted });
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
              className="project-input"
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
              className="project-select"
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
              className="project-input"
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
              className="project-input"
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
              className="project-input"
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
              className="project-input"
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
            className="project-input"
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
              type="text"
              id="valorAprovado"
              name="valorAprovado"
              value={formData.valorAprovado}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Garante formatação ao sair do campo
                const unformatted = unformatCurrency(e.target.value);
                const formatted = formatCurrency(unformatted);
                setFormData({ ...formData, valorAprovado: formatted });
              }}
              required
              disabled={loading}
              placeholder="R$ 0,00"
              className="project-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="valorCaptado" className="form-label">
              Valor Captado (R$) *
            </label>
            <input
              type="text"
              id="valorCaptado"
              name="valorCaptado"
              value={formData.valorCaptado}
              onChange={handleInputChange}
              onBlur={(e) => {
                // Garante formatação ao sair do campo
                const unformatted = unformatCurrency(e.target.value);
                const formatted = formatCurrency(unformatted);
                setFormData({ ...formData, valorCaptado: formatted });
              }}
              required
              disabled={loading}
              placeholder="R$ 0,00"
              className="project-input"
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
            className="project-select"
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
