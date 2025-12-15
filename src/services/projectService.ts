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
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { Project } from "../types/project";

// Helper para converter dados do Firestore para Project
const convertFirestoreProject = (
  docId: string,
  data: Record<string, unknown>
): Project => {
  return {
    id: docId,
    ...data,
    periodoExecucao: {
      inicio:
        (
          data.periodoExecucao as { inicio?: { toDate?: () => Date } }
        )?.inicio?.toDate?.() ||
        (data.periodoExecucao as { inicio?: Date })?.inicio ||
        new Date(),
      fim:
        (
          data.periodoExecucao as { fim?: { toDate?: () => Date } }
        )?.fim?.toDate?.() ||
        (data.periodoExecucao as { fim?: Date })?.fim ||
        new Date(),
    },
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
      (data.createdAt as Date) ||
      new Date(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
      (data.updatedAt as Date) ||
      new Date(),
  } as Project;
};

// Helper para converter Project para formato do Firestore
const convertProjectToFirestore = (
  project: Project
): Record<string, unknown> => {
  return {
    nome: project.nome,
    linha: project.linha,
    periodoExecucao: {
      inicio: Timestamp.fromDate(
        project.periodoExecucao.inicio instanceof Date
          ? project.periodoExecucao.inicio
          : new Date(project.periodoExecucao.inicio)
      ),
      fim: Timestamp.fromDate(
        project.periodoExecucao.fim instanceof Date
          ? project.periodoExecucao.fim
          : new Date(project.periodoExecucao.fim)
      ),
    },
    proponente: project.proponente,
    municipio: project.municipio,
    patrocinadores: project.patrocinadores,
    valorAprovado: project.valorAprovado,
    valorCaptado: project.valorCaptado,
    statusGeral: project.statusGeral,
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

export const projectService = {
  // Criar novo projeto
  async create(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    try {
      const projectData = {
        ...convertProjectToFirestore(project as Project),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "projects"), projectData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar projeto no banco de dados");
      }

      return convertFirestoreProject(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar projeto: ${error}`);
    }
  },

  // Buscar todos os projetos
  async getAll(): Promise<Project[]> {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreProject(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar projetos: ${error}`);
    }
  },

  // Buscar projeto por ID
  async getById(id: string): Promise<Project | null> {
    try {
      const docSnap = await getDoc(doc(db, "projects", id));

      if (!docSnap.exists()) {
        return null;
      }

      return convertFirestoreProject(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar projeto: ${error}`);
    }
  },

  // Atualizar projeto
  async update(id: string, project: Partial<Project>): Promise<void> {
    try {
      const projectData = convertProjectToFirestore(project as Project);
      await updateDoc(doc(db, "projects", id), projectData);
    } catch (error) {
      throw new Error(`Erro ao atualizar projeto: ${error}`);
    }
  },

  // Deletar projeto
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "projects", id));
    } catch (error) {
      throw new Error(`Erro ao deletar projeto: ${error}`);
    }
  },
};
