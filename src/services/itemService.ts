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
import type { Item } from "../types/financial";

const convertFirestoreItem = (
  docId: string,
  data: Record<string, unknown>
): Item => {
  return {
    id: docId,
    ...data,
    dataDespesa:
      data.dataDespesa
        ? ((data.dataDespesa as { toDate?: () => Date })?.toDate?.() ||
           (data.dataDespesa as Date) ||
           null)
        : null,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
      (data.createdAt as Date) ||
      new Date(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
      (data.updatedAt as Date) ||
      new Date(),
  } as Item;
};

const convertItemToFirestore = (item: Item): Record<string, unknown> => {
  return {
    nome: item.nome,
    descricao: item.descricao || "",
    rubricaId: item.rubricaId,
    fornecedorId: item.fornecedorId || null,
    valorPrevisto: item.valorPrevisto,
    valorExecutado: item.valorExecutado,
    dataDespesa: item.dataDespesa
      ? Timestamp.fromDate(
          item.dataDespesa instanceof Date
            ? item.dataDespesa
            : new Date(item.dataDespesa)
        )
      : null,
    numeroNF: item.numeroNF || "",
    comprovantesAnexados: item.comprovantesAnexados || [],
    observacoes: item.observacoes || "",
    projetoId: item.projetoId,
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

export const itemService = {
  async create(
    item: Omit<Item, "id" | "createdAt" | "updatedAt">
  ): Promise<Item> {
    try {
      const itemData = {
        ...convertItemToFirestore(item as Item),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "itens"), itemData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar item no banco de dados");
      }

      return convertFirestoreItem(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar item: ${error}`);
    }
  },

  async getByProjectId(projectId: string): Promise<Item[]> {
    try {
      const q = query(
        collection(db, "itens"),
        where("projetoId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreItem(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar itens: ${error}`);
    }
  },

  async getByRubricaId(rubricaId: string): Promise<Item[]> {
    try {
      const q = query(
        collection(db, "itens"),
        where("rubricaId", "==", rubricaId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreItem(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar itens: ${error}`);
    }
  },

  async getById(id: string): Promise<Item | null> {
    try {
      const docSnap = await getDoc(doc(db, "itens", id));
      if (!docSnap.exists()) return null;
      return convertFirestoreItem(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar item: ${error}`);
    }
  },

  async update(id: string, item: Partial<Item>): Promise<void> {
    try {
      const itemData = convertItemToFirestore(item as Item);
      await updateDoc(doc(db, "itens", id), itemData);
    } catch (error) {
      throw new Error(`Erro ao atualizar item: ${error}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "itens", id));
    } catch (error) {
      throw new Error(`Erro ao deletar item: ${error}`);
    }
  },
};