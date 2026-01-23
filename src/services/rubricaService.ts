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
import type { Rubrica } from "../types/financial";

const convertFirestoreRubrica = (
  docId: string,
  data: Record<string, unknown>
): Rubrica => {
  return {
    id: docId,
    ...data,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
      (data.createdAt as Date) ||
      new Date(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
      (data.updatedAt as Date) ||
      new Date(),
  } as Rubrica;
};

const convertRubricaToFirestore = (
  rubrica: Rubrica
): Record<string, unknown> => {
  return {
    nome: rubrica.nome,
    descricao: rubrica.descricao || "",
    projetoId: rubrica.projetoId,
    limitePercentual: rubrica.limitePercentual || null,
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

export const rubricaService = {
  async create(
    rubrica: Omit<Rubrica, "id" | "createdAt" | "updatedAt">
  ): Promise<Rubrica> {
    try {
      const rubricaData = {
        ...convertRubricaToFirestore(rubrica as Rubrica),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "rubricas"), rubricaData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar rubrica no banco de dados");
      }

      return convertFirestoreRubrica(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar rubrica: ${error}`);
    }
  },

  async getByProjectId(projectId: string): Promise<Rubrica[]> {
    try {
      const q = query(
        collection(db, "rubricas"),
        where("projetoId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreRubrica(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar rubricas: ${error}`);
    }
  },

  async getById(id: string): Promise<Rubrica | null> {
    try {
      const docSnap = await getDoc(doc(db, "rubricas", id));
      if (!docSnap.exists()) return null;
      return convertFirestoreRubrica(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar rubrica: ${error}`);
    }
  },

  async update(id: string, rubrica: Partial<Rubrica>): Promise<void> {
    try {
      const rubricaData = convertRubricaToFirestore(rubrica as Rubrica);
      await updateDoc(doc(db, "rubricas", id), rubricaData);
    } catch (error) {
      throw new Error(`Erro ao atualizar rubrica: ${error}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "rubricas", id));
    } catch (error) {
      throw new Error(`Erro ao deletar rubrica: ${error}`);
    }
  },
};