import { db } from "../lib/firebaseconfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import type { Goal } from "../types/goal";

// Helper para converter dados do Firestore para Goal
const convertFirestoreGoal = (
  docId: string,
  data: Record<string, unknown>
): Goal => {
  return {
    id: docId,
    ...data,
    dataLimite:
      (data.dataLimite as { toDate?: () => Date })?.toDate?.() ||
      (data.dataLimite as Date) ||
      new Date(),
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
      (data.createdAt as Date) ||
      new Date(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
      (data.updatedAt as Date) ||
      new Date(),
  } as Goal;
};

// Helper para converter Goal para formato do Firestore
const convertGoalToFirestore = (goal: Goal): Record<string, unknown> => {
  return {
    nome: goal.nome,
    dataLimite: Timestamp.fromDate(
      goal.dataLimite instanceof Date
        ? goal.dataLimite
        : new Date(goal.dataLimite)
    ),
    responsavel: goal.responsavel,
    documentosAnexos: goal.documentosAnexos,
    status: goal.status,
    observacoes: goal.observacoes || "",
    projetoId: goal.projetoId,
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

export const goalService = {
  // Criar nova meta
  async create(goal: Omit<Goal, "id" | "createdAt" | "updatedAt">): Promise<Goal> {
    try {
      const goalData = {
        ...convertGoalToFirestore(goal as Goal),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "goals"), goalData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar meta no banco de dados");
      }

      return convertFirestoreGoal(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar meta: ${error}`);
    }
  },

  // Buscar todas as metas de um projeto
  async getByProjectId(projectId: string): Promise<Goal[]> {
    try {
      // Removido orderBy para evitar necessidade de índice composto
      // A ordenação será feita no cliente
      const q = query(
        collection(db, "goals"),
        where("projetoId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);

      const goals = querySnapshot.docs.map((docSnap) =>
        convertFirestoreGoal(docSnap.id, docSnap.data())
      );

      // Ordenar por data limite (mais antiga primeiro)
      return goals.sort((a, b) => {
        const dateA = a.dataLimite instanceof Date 
          ? a.dataLimite 
          : new Date(a.dataLimite);
        const dateB = b.dataLimite instanceof Date 
          ? b.dataLimite 
          : new Date(b.dataLimite);
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      throw new Error(`Erro ao buscar metas: ${error}`);
    }
  },

  // Buscar meta por ID
  async getById(id: string): Promise<Goal | null> {
    try {
      const docSnap = await getDoc(doc(db, "goals", id));

      if (!docSnap.exists()) {
        return null;
      }

      return convertFirestoreGoal(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar meta: ${error}`);
    }
  },

  // Atualizar meta
  async update(id: string, goal: Partial<Goal>): Promise<void> {
    try {
      const goalData = convertGoalToFirestore(goal as Goal);
      await updateDoc(doc(db, "goals", id), goalData);
    } catch (error) {
      throw new Error(`Erro ao atualizar meta: ${error}`);
    }
  },

  // Deletar meta
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "goals", id));
    } catch (error) {
      throw new Error(`Erro ao deletar meta: ${error}`);
    }
  },
};