import React, { useState, useEffect, useMemo } from "react";
import type { Fornecedor, FornecedorFormData } from "../../../types/financial";
import "./FornecedorForm.css";

interface FornecedorFormProps {
    fornecedor?: Fornecedor | null;
    onSubmit: (fornecedor: Omit<Fornecedor, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const formatCNPJ = (value: string): string => {
    const clean = value.replace(/[^\d]/g, "");
    if (clean.length <= 14) {
      return clean
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  };

export const FornecedorForm: React.FC<FornecedorFormProps> = ({ fornecedor, onSubmit, onCancel, loading = false}) => {
    const initialFormData = useMemo(() => {
        if(!fornecedor){
            return {
                nome: "",
                cnpj: "",
                contato: "",
                email: "",
                telefone: "",
                endereco: "",
            }
        }

        return {
            nome: fornecedor.nome,
            cnpj: fornecedor.cnpj,
            contato: fornecedor.contato || "",
            email: fornecedor.email || "",
            telefone: fornecedor.telefone || "",
            endereco: fornecedor.endereco || "",
        }
    }, [fornecedor])

    const [formData, setFormData] = useState<FornecedorFormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData])
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!formData.nome.trim()) {
            setError("O nome do fornecedor é obrigatório");
            return;
        }

        if(!formData.cnpj.trim()) {
            setError("O CNPJ do fornecedor é obrigatório");
            return;
        }

        const cleanCNPJ = formData.cnpj.replace(/[^\d]/g, "");
        if (cleanCNPJ.length !== 14) {
            setError("CNPJ deve ter 14 dígitos");
            return;
        }

        try{
            await onSubmit({
                nome: formData.nome.trim(),
                cnpj: cleanCNPJ,
                contato: formData.contato.trim() || "",
                email: formData.email.trim(),
                telefone: formData.telefone.trim(),
                endereco: formData.endereco.trim(),
            })
        } catch(error){
            setError(error instanceof Error ? error.message : "Ocorreu um erro ao salvar o fornecedor");
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        if(name === "cnpj"){
            setFormData({...formData, [name]: formatCNPJ(value)})
        } else {
            setFormData({...formData, [name]: value})
        }
    }


    return (
        <div className="fornecedor-form-container">
          <form onSubmit={handleSubmit} className="fornecedor-form">
            <h2 className="fornecedor-form-title">
              {fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
            </h2>
    
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">
                  Nome do Fornecedor *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="Nome da empresa"
                  className="fornecedor-input"
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="cnpj" className="form-label">
                  CNPJ *
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="fornecedor-input"
                />
              </div>
            </div>

            <div className="form-row">
          <div className="form-group">
            <label htmlFor="contato" className="form-label">
              Contato
            </label>
            <input
              type="text"
              id="contato"
              name="contato"
              value={formData.contato}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Nome do contato"
              className="fornecedor-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="email@exemplo.com"
              className="fornecedor-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="(00) 00000-0000"
              className="fornecedor-input"
            />
          </div>
        </div>

        
        <div className="form-group">
          <label htmlFor="endereco" className="form-label">
            Endereço
          </label>
          <textarea
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            placeholder="Endereço completo"
            className="fornecedor-textarea"
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
            {loading ? "Salvando..." : fornecedor ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
};
