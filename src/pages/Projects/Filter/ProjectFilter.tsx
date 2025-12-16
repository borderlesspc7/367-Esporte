import React, { useState } from "react";
import { Filter, X, Search } from "lucide-react";
import type {
  ProjectFilters,
  ProjectLine,
  ProjectStatus,
} from "../../../types/project";
import "./ProjectFilter.css";

interface FilterProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  onReset: () => void;
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

export const ProjectFilter: React.FC<FilterProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof ProjectFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.linha !== "Todos" ||
      filters.statusGeral !== "Todos" ||
      filters.municipio !== "" ||
      filters.periodoInicio !== "" ||
      filters.periodoFim !== "" ||
      filters.valorAprovadoMin !== "" ||
      filters.valorAprovadoMax !== "" ||
      filters.valorCaptadoMin !== "" ||
      filters.valorCaptadoMax !== ""
    );
  };

  const handleReset = () => {
    onReset();
    setIsExpanded(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    if (filters.search !== "") count++;
    if (filters.linha !== "Todos") count++;
    if (filters.statusGeral !== "Todos") count++;
    if (filters.municipio !== "") count++;
    if (filters.periodoInicio !== "") count++;
    if (filters.periodoFim !== "") count++;
    if (filters.valorAprovadoMin !== "") count++;
    if (filters.valorAprovadoMax !== "") count++;

    return count;
  };

  return (
    <div className="project-filter-container">
      <div className="filter-header">
        <div className="filter-search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, proponente ou município"
            className="filter-search-input"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
          {filters.search && (
            <button
              className="clear-search-btn"
              title="Limpar busca"
              onClick={() => handleChange("search", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-header-actions">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`btn-toggle-filters ${isExpanded ? "active" : ""}`}
          >
            <Filter size={16} />
            Filtros Avançados
            {hasActiveFilters() && (
              <span className="filter-badge">{getActiveFiltersCount()}</span>
            )}
          </button>

          {hasActiveFilters() && (
            <button onClick={handleReset} className="btn-reset-filters">
              <X size={18} />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="linha" className="filter-label">
                Linha
              </label>
              <select
                id="linha"
                value={filters.linha}
                onChange={(e) => handleChange("linha", e.target.value)}
                className="filter-select"
              >
                <option value="Todos">Todas as linhas</option>
                {PROJECT_LINES.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="statusGeral" className="filter-label">
                Status
              </label>
              <select
                id="statusGeral"
                value={filters.statusGeral}
                onChange={(e) => handleChange("statusGeral", e.target.value)}
                className="filter-select"
              >
                <option value="Todos">Todos os status</option>
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="municipio" className="filter-label">
                Município
              </label>
              <input
                type="text"
                id="municipio"
                value={filters.municipio}
                onChange={(e) => handleChange("municipio", e.target.value)}
                placeholder="Filtrar por município"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="periodoInicio" className="filter-label">
                Período - Data Início
              </label>
              <input
                type="date"
                id="periodoInicio"
                value={filters.periodoInicio}
                onChange={(e) => handleChange("periodoInicio", e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="periodoFim" className="filter-label">
                Período - Data Fim
              </label>
              <input
                type="date"
                id="periodoFim"
                value={filters.periodoFim}
                onChange={(e) => handleChange("periodoFim", e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="valorAprovadoMin" className="filter-label">
                Valor Aprovado - Mínimo (R$)
              </label>
              <input
                type="number"
                id="valorAprovadoMin"
                value={filters.valorAprovadoMin}
                onChange={(e) =>
                  handleChange("valorAprovadoMin", e.target.value)
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="valorAprovadoMax" className="filter-label">
                Valor Aprovado - Máximo (R$)
              </label>
              <input
                type="number"
                id="valorAprovadoMax"
                value={filters.valorAprovadoMax}
                onChange={(e) =>
                  handleChange("valorAprovadoMax", e.target.value)
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="valorCaptadoMin" className="filter-label">
                Valor Captado - Mínimo (R$)
              </label>
              <input
                type="number"
                id="valorCaptadoMin"
                value={filters.valorCaptadoMin}
                onChange={(e) =>
                  handleChange("valorCaptadoMin", e.target.value)
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="valorCaptadoMax" className="filter-label">
                Valor Captado - Máximo (R$)
              </label>
              <input
                type="number"
                id="valorCaptadoMax"
                value={filters.valorCaptadoMax}
                onChange={(e) =>
                  handleChange("valorCaptadoMax", e.target.value)
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
