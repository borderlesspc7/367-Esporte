import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { rubricaService } from "../../services/rubricaService";
import { fornecedorService } from "../../services/fornecedorService";
import { itemService } from "../../services/itemService";
import { relatorioService } from "../../services/relatorioService";
import type { Rubrica, Fornecedor, Item, RelatorioExecucao } from "../../types/financial";
import { RubricaForm } from "../../pages/Financeiro/components/RubricaForm";
import { FornecedorForm } from "../../pages/Financeiro/components/FornecedorForm";
import { ItemForm } from "../../pages/Financeiro/components/ItemForm";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import "./Financial.css";

type viewMode = "rubricas" | "fornecedores" | "itens" | "relatorios";

export const Financial: React.FC = () => {
    const { projectId} = useParams<{projectId: string}>();
    const [viewMode, setViewMode] = useState<viewMode>("rubricas");

    const [rubricas, setRubricas] = useState<Rubrica[]>([]);
    const [showRubricaForm, setShowRubricaForm] = useState(false);
    const [editingRubrica, setEditingRubrica] = useState<Rubrica | null>(null);

    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [showFornecedorForm, setShowFornecedorForm] = useState(false);
    const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);

    const [itens, setItens] = useState<Item[]>([]);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    const [relatorios, setRelatorios] = useState<RelatorioExecucao[]>([]);
    const [alertas, setAlertas] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const loadData = useCallback(async () => {
      if(!projectId) return

      try {
        setLoading(true);
        setError(null);

        if(viewMode === "rubricas"){
          const data = await rubricaService.getByProjectId(projectId);
          setRubricas(data);
        } else if(viewMode === "fornecedores"){
          const data = await fornecedorService.getAll();
          setFornecedores(data);
        } else if(viewMode === "itens"){
          const data = await itemService.getByProjectId(projectId);
          setItens(data);
        } else if(viewMode === "relatorios"){
          const relatoriosData = await relatorioService.gerarRelatorioExecucao(projectId);
          const alertasData = await relatorioService.gerarAlertas(projectId);
          setRelatorios(relatoriosData);
          setAlertas(alertasData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }, [projectId, viewMode]);

    useEffect(() => {
      if(projectId){
        loadData();
      }
    }, [projectId, viewMode, loadData]);

    const handleCreateRubrica = async (rubrica: Omit<Rubrica, "id" | "createdAt" | "updatedAt">) => {
      try{
        setFormLoading(true)
        await rubricaService.create(rubrica);
        await loadData();
        setShowRubricaForm(false)
        setEditingRubrica(null)
      } catch (err) {
        console.error("Erro ao criar rubrica:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleUpdateRubrica = async (
      rubrica: Omit<Rubrica, "id" | "createdAt" | "updatedAt">
    ) => {
      if(!editingRubrica?.id) return;
      try{
        setFormLoading(true)
        await rubricaService.update(editingRubrica.id, rubrica);
        await loadData();
        setShowRubricaForm(false)
        setEditingRubrica(null)
      } catch (err) {
        console.error("Erro ao atualizar rubrica:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleDeleteRubrica = async (id:string) => {
      if(!confirm("Tem certeza que deseja deletar esta rubrica?")) return;
      try{
        setFormLoading(true)
        await rubricaService.delete(id);
        await loadData();
      } catch (err) {
        console.error("Erro ao deletar rubrica:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleCreateFornecedor = async (fornecedor: Omit<Fornecedor, "id" | "createdAt" | "updatedAt">) => {
      try{
        setFormLoading(true)
        await fornecedorService.create(fornecedor);
        await loadData();
        setShowFornecedorForm(false)
        setEditingFornecedor(null)
      } catch (err) {
        console.error("Erro ao criar fornecedor:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleUpdateFornecedor = async (fornecedor: Omit<Fornecedor, "id" | "createdAt" | "updatedAt">) => {
      if(!editingFornecedor?.id) return;

      try{
        setFormLoading(true)
        await fornecedorService.update(editingFornecedor.id, fornecedor);
        await loadData();
        setShowFornecedorForm(false)
        setEditingFornecedor(null)
      } catch (err) {
        console.error("Erro ao atualizar fornecedor:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleDeleteFornecedor = async (id: string) => {
      if(!confirm("Tem certeza que deseja deletar este fornecedor?")) return;
      try{
        setFormLoading(true)
        await fornecedorService.delete(id);
        await loadData();
      } catch (err) {
        console.error("Erro ao deletar fornecedor:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleCreateItem = async (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
      try{
        setFormLoading(true)
        await itemService.create(item);
        await loadData();
        setShowItemForm(false)
        setEditingItem(null)
      } catch (err) {
        console.error("Erro ao criar item:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleUpdateItem = async (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
      if(!editingItem?.id) return;
      
      try{
        setFormLoading(true)
        await itemService.update(editingItem.id, item);
        await loadData();
        setShowItemForm(false)
        setEditingItem(null)
      } catch (err) {
        console.error("Erro ao atualizar item:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const handleDeleteItem = async (id: string) => {
      if(!confirm("Tem certeza que deseja deletar este item?")) return;

      try{
        setFormLoading(true)
        await itemService.delete(id);
        await loadData();
      } catch (err) {
        console.error("Erro ao deletar item:", err);
      } finally {
        setFormLoading(false);
      }
    }

    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };
  
    const formatDate = (date: Date | string | null): string => {
      if (!date) return "-";
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleDateString("pt-BR");
    };


    if (!projectId) {
      return (
        <div className="financial-container">
          <div className="error-banner">Projeto não encontrado</div>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className="financial-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando dados financeiros...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="financial-container">
        <div className="financial-header">
          <h1 className="financial-title">Execução Financeira</h1>
          <p className="financial-subtitle">
            Gerencie rubricas, itens, fornecedores e orçamentos
          </p>
        </div>
  
        <div className="financial-tabs">
          <button
            onClick={() => setViewMode("rubricas")}
            className={`tab-button ${viewMode === "rubricas" ? "active" : ""}`}
          >
            <FileText size={20} />
            Rubricas
          </button>
          <button
            onClick={() => setViewMode("fornecedores")}
            className={`tab-button ${viewMode === "fornecedores" ? "active" : ""}`}
          >
            <Building2 size={20} />
            Fornecedores
          </button>
          <button
            onClick={() => setViewMode("itens")}
            className={`tab-button ${viewMode === "itens" ? "active" : ""}`}
          >
            <DollarSign size={20} />
            Itens
          </button>
          <button
            onClick={() => setViewMode("relatorios")}
            className={`tab-button ${viewMode === "relatorios" ? "active" : ""}`}
          >
            <TrendingUp size={20} />
            Relatórios
          </button>
        </div>
  
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

{viewMode === "rubricas" && (
  
        <div className="financial-view">
          {!showRubricaForm && (
            <button
              onClick={() => {
                setEditingRubrica(null);
                setShowRubricaForm(true);
              }}
              className="btn-new"
            >
              <Plus size={20} />
              Nova Rubrica
            </button>
          )}

          {showRubricaForm ? (
            <RubricaForm
              rubrica={editingRubrica}
              projetoId={projectId}
              onSubmit={editingRubrica ? handleUpdateRubrica : handleCreateRubrica}
              onCancel={() => {
                setShowRubricaForm(false);
                setEditingRubrica(null);
              }}
              loading={formLoading}
            />
          ) : (
            <>
              {rubricas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FileText size={64} />
                  </div>
                  <h3>Nenhuma rubrica cadastrada</h3>
                  <p>Comece criando sua primeira rubrica para organizar os gastos do projeto</p>
                  <button
                    onClick={() => {
                      setEditingRubrica(null);
                      setShowRubricaForm(true);
                    }}
                    className="btn-new btn-large"
                  >
                    <Plus size={20} />
                    Criar Primeira Rubrica
                  </button>
                </div>
              ) : (
                <div className="rubricas-grid">
                  {rubricas.map((rubrica) => (
                <div key={rubrica.id} className="rubrica-card">
                  <div className="card-header">
                    <h3>{rubrica.nome}</h3>
                    <div className="card-actions">
                      <button
                        onClick={() => {
                          setEditingRubrica(rubrica);
                          setShowRubricaForm(true);
                        }}
                        className="btn-icon btn-edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => rubrica.id && handleDeleteRubrica(rubrica.id)}
                        className="btn-icon btn-delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {rubrica.descricao && (
                    <p className="card-description">{rubrica.descricao}</p>
                  )}
                  {rubrica.limitePercentual && (
                    <div className="card-info">
                      <span className="info-label">Limite:</span>
                      <span className="info-value">
                        {rubrica.limitePercentual}%
                      </span>
                    </div>
                  )}
                </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

{viewMode === "fornecedores" && (
        <div className="financial-view">
          {!showFornecedorForm && (
            <button
              onClick={() => {
                setEditingFornecedor(null);
                setShowFornecedorForm(true);
              }}
              className="btn-new"
            >
              <Plus size={20} />
              Novo Fornecedor
            </button>
          )}

          {showFornecedorForm ? (
            <FornecedorForm
              fornecedor={editingFornecedor}
              onSubmit={
                editingFornecedor ? handleUpdateFornecedor : handleCreateFornecedor
              }
              onCancel={() => {
                setShowFornecedorForm(false);
                setEditingFornecedor(null);
              }}
              loading={formLoading}
            />
          ) : (
            <>
              {fornecedores.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Building2 size={64} />
                  </div>
                  <h3>Nenhum fornecedor cadastrado</h3>
                  <p>Cadastre fornecedores para associar aos itens financeiros</p>
                  <button
                    onClick={() => {
                      setEditingFornecedor(null);
                      setShowFornecedorForm(true);
                    }}
                    className="btn-new btn-large"
                  >
                    <Plus size={20} />
                    Cadastrar Primeiro Fornecedor
                  </button>
                </div>
              ) : (
                <div className="fornecedores-grid">
                  {fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="fornecedor-card">
                  <div className="card-header">
                    <h3>{fornecedor.nome}</h3>
                    <div className="card-actions">
                      <button
                        onClick={() => {
                          setEditingFornecedor(fornecedor);
                          setShowFornecedorForm(true);
                        }}
                        className="btn-icon btn-edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          fornecedor.id && handleDeleteFornecedor(fornecedor.id)
                        }
                        className="btn-icon btn-delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="card-info">
                    <span className="info-label">CNPJ:</span>
                    <span className="info-value">{fornecedor.cnpj}</span>
                  </div>
                  {fornecedor.email && (
                    <div className="card-info">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{fornecedor.email}</span>
                    </div>
                  )}
                  {fornecedor.telefone && (
                    <div className="card-info">
                      <span className="info-label">Telefone:</span>
                      <span className="info-value">{fornecedor.telefone}</span>
                    </div>
                  )}
                </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

{viewMode === "itens" && (
        <div className="financial-view">
          {!showItemForm && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowItemForm(true);
              }}
              className="btn-new"
            >
              <Plus size={20} />
              Novo Item
            </button>
          )}

          {showItemForm ? (
            <ItemForm
              item={editingItem}
              projetoId={projectId}
              rubricas={rubricas}
              fornecedores={fornecedores}
              onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
              onCancel={() => {
                setShowItemForm(false);
                setEditingItem(null);
              }}
              loading={formLoading}
            />
          ) : (
            <>
              {itens.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <DollarSign size={64} />
                  </div>
                  <h3>Nenhum item cadastrado</h3>
                  <p>Cadastre itens financeiros para controlar os gastos do projeto</p>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemForm(true);
                    }}
                    className="btn-new btn-large"
                  >
                    <Plus size={20} />
                    Cadastrar Primeiro Item
                  </button>
                </div>
              ) : (
                <div className="itens-grid">
                  {itens.map((item) => {
                const rubrica = rubricas.find((r) => r.id === item.rubricaId);
                const fornecedor = fornecedores.find(
                  (f) => f.id === item.fornecedorId
                );

                return (
                  <div key={item.id} className="item-card">
                    <div className="card-header">
                      <h3>{item.nome}</h3>
                      <div className="card-actions">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowItemForm(true);
                          }}
                          className="btn-icon btn-edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => item.id && handleDeleteItem(item.id)}
                          className="btn-icon btn-delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="card-info">
                      <span className="info-label">Rubrica:</span>
                      <span className="info-value">{rubrica?.nome || "-"}</span>
                    </div>
                    {fornecedor && (
                      <div className="card-info">
                        <span className="info-label">Fornecedor:</span>
                        <span className="info-value">{fornecedor.nome}</span>
                      </div>
                    )}
                    <div className="card-financial">
                      <div className="financial-item">
                        <span className="financial-label">Previsto:</span>
                        <span className="financial-value">
                          {formatCurrency(item.valorPrevisto)}
                        </span>
                      </div>

                      <div className="financial-item">
                        <span className="financial-label">Executado:</span>
                        <span className="financial-value">
                          {formatCurrency(item.valorExecutado)}
                        </span>
                      </div>
                    </div>
                    {item.dataDespesa && (
                      <div className="card-info">
                        <span className="info-label">Data Despesa:</span>
                        <span className="info-value">
                          {formatDate(item.dataDespesa)}
                        </span>
                      </div>
                    )}
                    {item.numeroNF && (
                      <div className="card-info">
                        <span className="info-label">NF:</span>
                        <span className="info-value">{item.numeroNF}</span>
                      </div>
                    )}
                  </div>
                );
              })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* View: Relatórios */}
      {viewMode === "relatorios" && (
        <div className="financial-view">
          {alertas.length > 0 && (
            <div className="alertas-container">
              <h3 className="alertas-title">
                <AlertTriangle size={20} />
                Alertas
              </h3>
              {alertas.map((alerta, index) => (
                <div key={index} className="alerta-item">
                  {alerta}
                </div>
              ))}
            </div>
          )}

          {relatorios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <TrendingUp size={64} />
              </div>
              <h3>Nenhum relatório disponível</h3>
              <p>Cadastre rubricas e itens para gerar relatórios de execução financeira</p>
            </div>
          ) : (
            <div className="relatorios-grid">
              {relatorios.map((relatorio) => {
              const percentualDiferenca = relatorio.percentualLimite
                ? relatorio.percentualExecutado - relatorio.percentualLimite
                : 0;

              return (
                <div key={relatorio.rubricaId} className="relatorio-card">
                  <div className="relatorio-header">
                    <h3>{relatorio.rubricaNome}</h3>
                    <span
                      className={`status-badge status-${relatorio.status}`}
                    >
                      {relatorio.status === "acima_limite" && (
                        <XCircle size={16} />
                      )}
                      {relatorio.status === "proximo_limite" && (
                        <AlertTriangle size={16} />
                      )}
                      {relatorio.status === "dentro_limite" && (
                        <CheckCircle2 size={16} />
                      )}
                      {relatorio.status === "acima_limite"
                        ? "Acima do Limite"
                        : relatorio.status === "proximo_limite"
                        ? "Próximo do Limite"
                        : "Dentro do Limite"}
                    </span>
                  </div>

                  
                  <div className="relatorio-values">
                    <div className="value-item">
                      <span className="value-label">Valor Previsto</span>
                      <span className="value-amount">
                        {formatCurrency(relatorio.valorPrevisto)}
                      </span>
                    </div>
                    <div className="value-item">
                      <span className="value-label">Valor Executado</span>
                      <span className="value-amount">
                        {formatCurrency(relatorio.valorExecutado)}
                      </span>
                    </div>
                  </div>

                  <div className="relatorio-progress">
                    <div className="progress-header">
                      <span className="progress-label">Execução</span>
                      <span className="progress-percentage">
                        {relatorio.percentualExecutado.toFixed(2)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(relatorio.percentualExecutado, 100)}%`,
                          backgroundColor:
                            relatorio.status === "acima_limite"
                              ? "#ef4444"
                              : relatorio.status === "proximo_limite"
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      />
                      {relatorio.percentualLimite && (
                        <div
                          className="progress-limit"
                          style={{
                            left: `${relatorio.percentualLimite}%`,
                          }}
                        />
                      )}
                    </div>
                    {relatorio.percentualLimite && (
                      <div className="progress-footer">
                        <span className="limit-info">
                          Limite: {relatorio.percentualLimite}%
                        </span>
                        {percentualDiferenca > 0 && (
                          <span className="limit-exceeded">
                            Excedido em {percentualDiferenca.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relatorio-items">
                    <span className="items-label">
                      Itens: {relatorio.itens.length}
                    </span>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};





