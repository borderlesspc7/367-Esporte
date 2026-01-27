import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { goalService } from "../../services/goalService";
import type { Goal } from "../../types/goal";
import { GoalForm } from "./GoalForm";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { calcularSinaleira,type GoalStatus } from "../../types/goal";
import "./Goals.css";

export const Goals: React.FC = () => {
  const {projectId} = useParams();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if(projectId){
      loadGoals();
    }
  }, [projectId]);

  const loadGoals = async () => {
    if(!projectId) return;
    try{
      setLoading(true);
      setError(null);
      const data = await goalService.getByProjectId(projectId);
      setGoals(data);
    } catch(error){
      console.error("Erro ao carregar objetivos:", error);
      setError("Erro ao carregar objetivos");
    } finally{
      setLoading(false);
    }
  }

  const handleCreate = async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    try{
      setFormLoading(true);
      await goalService.create(goal);
      await loadGoals();
      setShowForm(false);
      setEditingGoal(null);
    } catch(error){
      console.error("Erro ao criar objetivo:", error);
      setError("Erro ao criar objetivo");
    } finally{
      setFormLoading(false);
    }
  }

  const handleUpdate = async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    try{
      setFormLoading(true);
      await goalService.update(editingGoal?.id || "", goal);
      await loadGoals();
      setShowForm(false);
      setEditingGoal(null);
    } catch(error){
      console.error("Erro ao atualizar objetivo:", error);
      setError("Erro ao atualizar objetivo");
    } finally{
      setFormLoading(false);
    }
  }
  
  const handleDelete = async (id: string) => {
    if(!confirm("Tem certeza que deseja deletar esta meta?")) return;

    try{
      setDeleteLoading(id);
      await goalService.delete(id);
      await loadGoals();
    } catch(error){
      console.error("Erro ao deletar objetivo:", error);
      setError("Erro ao deletar objetivo");
    } finally{
      setDeleteLoading(null);
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  }

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  }

  const formatDate = (date: Date | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluída":
        return <CheckCircle2 size={18} />;
      case "Em andamento":
        return <Clock size={18} />;
      case "Atrasada":
        return <AlertCircle size={18} />;
      case "Cancelada":
        return <XCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const getSinaleiraInfo = (status: string, dataLimite: Date | string) => {
    const sinaleira = calcularSinaleira(dataLimite, status as GoalStatus);

  const sinaleiras = {
    verde: {
      label: "Dentro do prazo",
      icon: <CheckCircle2 size={20} />,
      color: "#10b981"
    },
    amarelo: {
      label: "Atenção - 7 dias",
      icon: <AlertCircle size={20} />,
      color: "#f59e0b"
    },
    vermelho: {
      label: "Atrasada",
      icon: <AlertCircle size={20} />,
      color: "#ef4444"
    },
    azul: {
      label: "Concluída",
      icon: <CheckCircle2 size={20} />,
      color: "#3b82f6"
    }
  };

  return sinaleiras[sinaleira]
  };

  if (!projectId) {
    return (
      <div className="goals-container">
        <div className="error-banner">Projeto não encontrado</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="goals-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-container">
      <div className="goals-header">
        <div className="header-content">
          <h1 className="goals-title">Metas e Etapas</h1>
          <p className="goals-subtitle">
            Gerencie as metas físicas do projeto
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingGoal(null);
              setShowForm(true);
            }}
            className="btn-new-goal"
          >
            <Plus size={20} />
            Nova Meta
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon"><AlertCircle size={18} /></span>
          {error}
        </div>
      )}

      {showForm ? (
        <div className="form-wrapper">
          <GoalForm
            goal={editingGoal}
            projetoId={projectId}
            onSubmit={editingGoal ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
        ) : (
          <>
            {goals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CheckCircle2 size={64} />
                </div>
                <h3>Nenhuma meta encontrada</h3>
                <p>Comece criando a primeira meta do projeto</p>
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setShowForm(true);
                  }}
                  className="btn-new-goal btn-large"
                >
                  <Plus size={20} />
                  Criar Primeira Meta
                </button>
              </div>
            ) : (
              <div className="goals-grid">
                {goals.map((goal) => (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-card-header">
                      <div className="goal-header-top">
                        <div className="goal=sinaleira-wrapper">
                          <span className={`goal-sinaleira goal-sinaleira-${calcularSinaleira(goal.dataLimite, goal.status)}`} title={getSinaleiraInfo(goal.status, goal.dataLimite).label}>
                            {getSinaleiraInfo(goal.status, goal.dataLimite).icon}
                          </span>
                          <span className={`goal-status goal-status-${goal.status.toLowerCase().replace(/\s+/g, "-")}`}>
                            {getStatusIcon(goal.status)}
                            {goal.status}
                          </span>
                        </div>
                        <div className="goal-card-actions">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="btn-icon btn-icon-edit"
                          title="Editar"
                          disabled={deleteLoading === goal.id}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => goal.id && handleDelete(goal.id)}
                          className="btn-icon btn-icon-danger"
                          title="Excluir"
                          disabled={deleteLoading === goal.id}
                        >
                          {deleteLoading === goal.id ? (
                            <div className="spinner-small" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="goal-card-title">{goal.nome}</h3>
                  </div>

                  <div className="goal-card-body">
                    <div className="goal-info-item">
                      <div className="info-icon">
                        <Calendar size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Data Limite</span>
                        <span className="info-value">
                          {formatDate(goal.dataLimite)}
                        </span>
                      </div>
                    </div>
                    <div className="goal-info-item">
                      <div className="info-icon">
                        <User size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Responsável</span>
                        <span className="info-value">{goal.responsavel}</span>
                      </div>
                    </div>

                    {goal.documentosAnexos.length > 0 && (
                      <div className="goal-info-item">
                        <div className="info-icon">
                          <FileText size={18} />
                        </div>
                        <div className="info-content">
                          <span className="info-label">Documentos</span>
                          <span className="info-value">
                            {goal.documentosAnexos.join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {goal.observacoes && (
                      <div className="goal-observations">
                        <span className="observations-label">Observações:</span>
                        <p className="observations-text">{goal.observacoes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  }