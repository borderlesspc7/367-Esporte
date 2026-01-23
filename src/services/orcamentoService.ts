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
import type { Orcamento } from "../types/financial";

const convertFirestoreOrcamento = (
  docId: string,
  data: Record<string, unknown>
): Orcamento => {
  return {
    id: docId,
    ...data,
    dataOrcamento:
      (data.dataOrcamento as { toDate?: () => Date })?.toDate?.() ||
      (data.dataOrcamento as Date) ||
      new Date(),
    validade:
      data.validade
        ? ((data.validade as { toDate?: () => Date })?.toDate?.() ||
           (data.validade as Date) ||
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
  } as Orcamento;
};

const convertOrcamentoToFirestore = (
  orcamento: Orcamento
): Record<string, unknown> => {
  return {
    itemId: orcamento.itemId,
    fornecedorId: orcamento.fornecedorId,
    valor: orcamento.valor,
    dataOrcamento: Timestamp.fromDate(
      orcamento.dataOrcamento instanceof Date
        ? orcamento.dataOrcamento
        : new Date(orcamento.dataOrcamento)
    ),
    validade: orcamento.validade
      ? Timestamp.fromDate(
          orcamento.validade instanceof Date
            ? orcamento.validade
            : new Date(orcamento.validade)
        )
      : null,
    observacoes: orcamento.observacoes || "",
    aprovado: orcamento.aprovado,
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

export const orcamentoService = {
  async create(
    orcamento: Omit<Orcamento, "id" | "createdAt" | "updatedAt">
  ): Promise<Orcamento> {
    try {
      const orcamentoData = {
        ...convertOrcamentoToFirestore(orcamento as Orcamento),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "orcamentos"), orcamentoData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar orçamento no banco de dados");
      }

      return convertFirestoreOrcamento(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar orçamento: ${error}`);
    }
  },

  async getByItemId(itemId: string): Promise<Orcamento[]> {
    try {
      const q = query(
        collection(db, "orcamentos"),
        where("itemId", "==", itemId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreOrcamento(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar orçamentos: ${error}`);
    }
  },

  async getById(id: string): Promise<Orcamento | null> {
    try {
      const docSnap = await getDoc(doc(db, "orcamentos", id));
      if (!docSnap.exists()) return null;
      return convertFirestoreOrcamento(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar orçamento: ${error}`);
    }
  },

  async update(id: string, orcamento: Partial<Orcamento>): Promise<void> {
    try {
      const orcamentoData = convertOrcamentoToFirestore(orcamento as Orcamento);
      await updateDoc(doc(db, "orcamentos", id), orcamentoData);
    } catch (error) {
      throw new Error(`Erro ao atualizar orçamento: ${error}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "orcamentos", id));
    } catch (error) {
      throw new Error(`Erro ao deletar orçamento: ${error}`);
    }
  },
};