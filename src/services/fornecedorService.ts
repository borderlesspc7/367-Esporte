import { db } from "../lib/firebaseconfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import type { Fornecedor } from "../types/financial";

const convertFirestoreFornecedor = (
  docId: string,
  data: Record<string, unknown>
): Fornecedor => {
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
  } as Fornecedor;
};

const convertFornecedorToFirestore = (
  fornecedor: Fornecedor
): Record<string, unknown> => {
  return {
    nome: fornecedor.nome,
    cnpj: fornecedor.cnpj,
    contato: fornecedor.contato || "",
    email: fornecedor.email || "",
    telefone: fornecedor.telefone || "",
    endereco: fornecedor.endereco || "",
    updatedAt: Timestamp.fromDate(new Date()),
  };
};

// Função para validar CNPJ
const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, "");
  return cleanCNPJ.length === 14;
};

// Função para formatar CNPJ
const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, "");
  if (cleanCNPJ.length !== 14) return cnpj;
  return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12)}`;
};

export const fornecedorService = {
  async create(
    fornecedor: Omit<Fornecedor, "id" | "createdAt" | "updatedAt">
  ): Promise<Fornecedor> {
    try {
      if (!validateCNPJ(fornecedor.cnpj)) {
        throw new Error("CNPJ inválido");
      }

      const fornecedorData = {
        ...convertFornecedorToFirestore(fornecedor as Fornecedor),
        cnpj: formatCNPJ(fornecedor.cnpj),
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = await addDoc(collection(db, "fornecedores"), fornecedorData);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Erro ao criar fornecedor no banco de dados");
      }

      return convertFirestoreFornecedor(docRef.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao criar fornecedor: ${error}`);
    }
  },

  async getAll(): Promise<Fornecedor[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "fornecedores"));
      return querySnapshot.docs.map((docSnap) =>
        convertFirestoreFornecedor(docSnap.id, docSnap.data())
      );
    } catch (error) {
      throw new Error(`Erro ao buscar fornecedores: ${error}`);
    }
  },

  async getById(id: string): Promise<Fornecedor | null> {
    try {
      const docSnap = await getDoc(doc(db, "fornecedores", id));
      if (!docSnap.exists()) return null;
      return convertFirestoreFornecedor(docSnap.id, docSnap.data());
    } catch (error) {
      throw new Error(`Erro ao buscar fornecedor: ${error}`);
    }
  },

  async update(id: string, fornecedor: Partial<Fornecedor>): Promise<void> {
    try {
      if (fornecedor.cnpj && !validateCNPJ(fornecedor.cnpj)) {
        throw new Error("CNPJ inválido");
      }

      const fornecedorData = convertFornecedorToFirestore(fornecedor as Fornecedor);
      if (fornecedor.cnpj) {
        fornecedorData.cnpj = formatCNPJ(fornecedor.cnpj);
      }
      await updateDoc(doc(db, "fornecedores", id), fornecedorData);
    } catch (error) {
      throw new Error(`Erro ao atualizar fornecedor: ${error}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "fornecedores", id));
    } catch (error) {
      throw new Error(`Erro ao deletar fornecedor: ${error}`);
    }
  },
};