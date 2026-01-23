import React, { useState, useEffect, useMemo } from "react";
import type { Item, ItemFormData } from "../../../types/financial";
import type { Rubrica } from "../../../types/financial";
import type { Fornecedor } from "../../../types/financial";
import "./ItemForm.css";

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
    }
    const numValue = parseFloat(cleaned);
    return isNaN(numValue) || numValue < 0 ? "0" : numValue.toString();
  };

  interface ItemFormProps {
    item?: Item | null;
    projetoId: string;
    rubricas: Rubrica[];
    fornecedores: Fornecedor[];
    onSubmit: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    onCancel: () => void;
    loading? : boolean;
  }

  export const ItemForm: React.FC<ItemFormProps> = ({ item, projetoId, rubricas, fornecedores, onSubmit, onCancel, loading = false }) => {
    const initialFormData = useMemo(() => {
        if(!item){
            return{
                nome: "",
                descricao: "",
                rubricaId: "",
                fornecedorId: "",
                valorPrevisto: formatCurrency("0"),
                valorExecutado: formatCurrency("0"),
                dataDespesa: "",
                numeroNF: "",
                comprovantesAnexados: "",
                observacoes: "",
            }
        }

        const dataDespesaDate = item.dataDespesa ? item.dataDespesa instanceof Date ? item.dataDespesa : new Date(item.dataDespesa) : null

        return {
            nome: item.nome,
            descricao: item.descricao || "",
            rubricaId: item.rubricaId,
            fornecedorId: item.fornecedorId || "",
            valorPrevisto: formatCurrency(item.valorPrevisto),
            valorExecutado: formatCurrency(item.valorExecutado),
            dataDespesa: dataDespesaDate ? dataDespesaDate.toISOString().split("T")[0] : "",
            numeroNF: item.numeroNF || "",
            comprovantesAnexados: item.comprovantesAnexados.join(", "),
            observacoes: item.observacoes || "",
        }
        
    }, [item])

    const [formData, setFormData] = useState<ItemFormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
    
        if (!formData.nome.trim()) {
          setError("O nome do item é obrigatório");
          return;
        }
    
        if (!formData.rubricaId) {
          setError("A rubrica é obrigatória");
          return;
        }
    
        const valorPrevisto = parseFloat(unformatCurrency(formData.valorPrevisto));
        const valorExecutado = parseFloat(unformatCurrency(formData.valorExecutado));
    
        if (isNaN(valorPrevisto) || valorPrevisto < 0) {
          setError("O valor previsto deve ser um número válido");
          return;
        }
    
        if (isNaN(valorExecutado) || valorExecutado < 0) {
          setError("O valor executado deve ser um número válido");
          return;
        }
        try {
            const comprovantesArray = formData.comprovantesAnexados
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c.length > 0);
      
            await onSubmit({
              nome: formData.nome.trim(),
              descricao: formData.descricao.trim(),
              rubricaId: formData.rubricaId,
              fornecedorId: formData.fornecedorId || undefined,
              valorPrevisto: valorPrevisto,
              valorExecutado: valorExecutado,
              dataDespesa: formData.dataDespesa ? new Date(formData.dataDespesa) : undefined,
              numeroNF: formData.numeroNF.trim(),
              comprovantesAnexados: comprovantesArray,
              observacoes: formData.observacoes.trim(),
              projetoId: projetoId,
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar item");
          }
        };
      
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;

        if(name === "valorPrevisto" || name === "valorExecutado"){
            const unformatted = unformatCurrency(value);
            const formatted = formatCurrency(unformatted);
            setFormData({...formData, [name]: formatted});
        } else {
            setFormData({...formData, [name]: value});
        }
    }
  
    return (
        <div className="item-form-container">
          <form onSubmit={handleSubmit} className="item-form">
            <h2 className="item-form-title">
              {item ? "Editar Item" : "Novo Item"}
            </h2>
    
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome do Item *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Ex: Bola de futebol, Uniformes, etc."
                className="item-input"
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
                placeholder="Descreva o item..."
                className="item-textarea"
              />
            </div>
            <div className="form-row">
          <div className="form-group">
            <label htmlFor="rubricaId" className="form-label">
              Rubrica *
            </label>
            <select
              id="rubricaId"
              name="rubricaId"
              value={formData.rubricaId}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="item-select"
            >
              <option value="">Selecione uma rubrica</option>
              {rubricas.map((rubrica) => (
                <option key={rubrica.id} value={rubrica.id}>
                  {rubrica.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fornecedorId" className="form-label">
              Fornecedor
            </label>
            <select
              id="fornecedorId"
              name="fornecedorId"
              value={formData.fornecedorId}
              onChange={handleInputChange}
              disabled={loading}
              className="item-select"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome} - {fornecedor.cnpj}
                </option>
              ))}
            </select>
          </div>
          </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="valorPrevisto" className="form-label">
              Valor Previsto (R$) *
            </label>
            <input
              type="text"
              id="valorPrevisto"
              name="valorPrevisto"
              value={formData.valorPrevisto}
              onChange={handleInputChange}
              onBlur={(e) => {
                const unformatted = unformatCurrency(e.target.value);
                const formatted = formatCurrency(unformatted);
                setFormData({ ...formData, valorPrevisto: formatted });
              }}
              required
              disabled={loading}
              placeholder="R$ 0,00"
              className="item-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="valorExecutado" className="form-label">
              Valor Executado (R$) *
            </label>
            <input
              type="text"
              id="valorExecutado"
              name="valorExecutado"
              value={formData.valorExecutado}
              onChange={handleInputChange}
              onBlur={(e) => {
                const unformatted = unformatCurrency(e.target.value);
                const formatted = formatCurrency(unformatted);
                setFormData({ ...formData, valorExecutado: formatted });
              }}
              required
              disabled={loading}
              placeholder="R$ 0,00"
              className="item-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dataDespesa" className="form-label">
              Data da Despesa
            </label>
            <input
              type="date"
              id="dataDespesa"
              name="dataDespesa"
              value={formData.dataDespesa}
              onChange={handleInputChange}
              disabled={loading}
              className="item-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="numeroNF" className="form-label">
              Número da NF
            </label>
            <input
              type="text"
              id="numeroNF"
              name="numeroNF"
              value={formData.numeroNF}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Número da nota fiscal"
              className="item-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comprovantesAnexados" className="form-label">
            Comprovantes Anexados
          </label>
          <input
            type="text"
            id="comprovantesAnexados"
            name="comprovantesAnexados"
            value={formData.comprovantesAnexados}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Separe múltiplos comprovantes por vírgula"
            className="item-input"
          />
          <small className="form-hint">
            Exemplo: nf001.pdf, comprovante1.jpg, recibo.pdf
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
            placeholder="Adicione observações sobre este item..."
            className="item-textarea"
          />
        </div>
        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
                <button type="button" onClick={onCancel} disabled={loading} className="btn-cancel">
                Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
            </button>
        </div>
    </form>
    </div>
);
  }