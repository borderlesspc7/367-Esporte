import React, { useState, useEffect, useMemo} from "react";
import type { Goal, GoalFormData, GoalStatus } from "../../types/goal";
import "./GoalForm.css";

interface GoalFormProps {
    goal?: Goal | null;
    projetoId: string;
    onSubmit: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const GOAL_STATUSES: GoalStatus[] = [
    "Não iniciada",
    "Em andamento",
    "Concluída",
    "Atrasada",
    "Cancelada",
]

export const GoalForm: React.FC<GoalFormProps> = ({ goal, projetoId, onSubmit, onCancel, loading }) => {
    const initialFormData = useMemo<GoalFormData>(() => {
        if(!goal){
            return {
                nome: "",
                dataLimite: "",
                responsavel: "",
                documentosAnexos: "",
                status: "Não iniciada",
                observacoes: "",
            }
        }

        const dataLimiteDate = goal.dataLimite instanceof Date ? goal.dataLimite : new Date(goal.dataLimite)

        return {
            nome: goal.nome,
            dataLimite: dataLimiteDate.toISOString().split('T')[0],
            responsavel: goal.responsavel,
            documentosAnexos: goal.documentosAnexos.join(", "),
            status: goal.status,
            observacoes: goal.observacoes || "",
        }
    }, [goal?.id])

    const [formData, setFormData] = useState<GoalFormData>(initialFormData)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setFormData(initialFormData)
    }, [initialFormData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!formData.nome.trim()) {
            setError("O nome da meta é obrigatório");
            return;
          }
      
          if (!formData.dataLimite) {
            setError("A data limite é obrigatória");
            return;
          }
      
          const dataLimiteDate = new Date(formData.dataLimite);
          if (isNaN(dataLimiteDate.getTime())) {
            setError("Data limite inválida");
            return;
          }
      
          if (!formData.responsavel.trim()) {
            setError("O responsável é obrigatório");
            return;
          }

          try{
            const documentosArray = formData.documentosAnexos.split(",").map((doc) => doc.trim()).filter((doc) => doc.length > 0)

            await onSubmit({
                nome: formData.nome.trim(),
                dataLimite: dataLimiteDate,
                responsavel: formData.responsavel.trim(),
                documentosAnexos: documentosArray,
                status: formData.status,
                observacoes: formData.observacoes.trim(),
                projetoId,
            })
          } catch (error) {
            setError(error instanceof Error ? error.message : "Erro ao salvar meta");
          }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    return (
        <div className="goal-form-container">
            <form onSubmit={handleSubmit} className="goal-form">
                <h2 className="goal-form-title">{goal ? "Editar Meta" : "Nova Meta"}</h2>

                <div className="form-group">
                    <label htmlFor="nome" className="form-label">Nome da Meta *</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required disabled={loading} placeholder="Ex: Compra de equipamentos esportivos" className="goal-input" />
                </div>

                <div className="form-row">
          <div className="form-group">
            <label htmlFor="dataLimite" className="form-label">
              Data Limite *
            </label>
            <input
              type="date"
              id="dataLimite"
              name="dataLimite"
              value={formData.dataLimite}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="goal-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsavel" className="form-label">
              Responsável *
            </label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Nome do responsável"
              className="goal-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="goal-select"
          >
            {GOAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="documentosAnexos" className="form-label">
            Documentos Anexos
          </label>
          <input
            type="text"
            id="documentosAnexos"
            name="documentosAnexos"
            value={formData.documentosAnexos}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Separe múltiplos documentos por vírgula"
            className="goal-input"
          />
          <small className="form-hint">
            Exemplo: documento1.pdf, documento2.pdf, imagem.jpg
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="observacoes" className="form-label">
            Observações
          </label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            disabled={loading}
            rows={4}
            placeholder="Adicione observações sobre esta meta..."
            className="goal-textarea"
          />
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
            {loading ? "Salvando..." : goal ? "Atualizar" : "Criar"}
          </button>
        </div>
            </form>
        </div>
    )
}