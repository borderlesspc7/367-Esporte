import React, { useState, useEffect, useMemo } from 'react';
import type { Rubrica, RubricaFormData } from '../../../types/financial';
import "./RubricaForm.css"

interface RubricaFormProps {
    rubrica?: Rubrica | null;
    projetoId: string;
    onSubmit: (rubrica: Omit<Rubrica, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export const RubricaForm: React.FC<RubricaFormProps> = ({ rubrica, projetoId, onSubmit, onCancel, loading = false}) => {

    const initialFormData = useMemo(() => {
        if(!rubrica) {
            return {
                nome: "",
                descricao: "",
                limitePercentual: "",
            }
        }
        return {
            nome: rubrica.nome,
            descricao: rubrica.descricao || "",
            limitePercentual: rubrica.limitePercentual?.toString() || "",
        }
    }, [rubrica])

    const [formData, setFormData] = useState<RubricaFormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData])

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if(!formData.nome.trim()) {
            setError("O nome da rubrica é obrigatório");
            return;
        }

        try{
            await onSubmit({
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                limitePercentual: formData.limitePercentual ? parseFloat(formData.limitePercentual) : undefined,
                projetoId,
            })
        } catch(error){
            setError(error instanceof Error ? error.message : "Ocorreu um erro ao salvar a rubrica");
        }
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    return (
        <div className="rubrica-form-container">
          <form onSubmit={handleSubmit} className="rubrica-form">
            <h2 className="rubrica-form-title">
              {rubrica ? "Editar Rubrica" : "Nova Rubrica"}
            </h2>
    
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome da Rubrica *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Ex: Equipamentos, Material Esportivo, etc."
                className="rubrica-input"
              />
            </div>
    
            <div className="form-group">
              <label htmlFor="descricao" className="form-label">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                disabled={loading}
                rows={3}
                placeholder="Descreva a rubrica..."
                className="rubrica-textarea"
              />
            </div>

            <div className="form-group">
          <label htmlFor="limitePercentual" className="form-label">
            Limite Percentual (%)
          </label>
          <input
            type="number"
            id="limitePercentual"
            name="limitePercentual"
            value={formData.limitePercentual}
            onChange={handleInputChange}
            disabled={loading}
            min="0"
            max="100"
            step="0.01"
            placeholder="Ex: 30.5"
            className="rubrica-input"
          />
          <small className="form-hint">
            Percentual máximo do valor total do projeto que pode ser gasto nesta rubrica
          </small>
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
            {loading ? "Salvando..." : rubrica ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};