import { auth, db } from "../lib/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/user";
import getFirebaseErrorMessage from "../components/ui/ErrorMessage";

// Helper para converter dados do Firestore para User
const convertFirestoreUser = (data: Record<string, unknown>): User => {
  return {
    ...data,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
      (data.createdAt as Date) ||
      new Date(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
      (data.updatedAt as Date) ||
      new Date(),
  } as User;
};

// Helper para remover campos undefined (Firestore não aceita undefined)
const removeUndefinedFields = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
};

interface firebaseError {
  code?: string;
  message?: string;
}

export const authService = {
  async logOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const message = getFirebaseErrorMessage(error as firebaseError | string);
      throw new Error(message);
    }
  },

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = convertFirestoreUser(userDoc.data());
      const updateUserData = {
        ...userData,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), updateUserData);
      return updateUserData;
    } catch (error) {
      const message = getFirebaseErrorMessage(error as firebaseError | string);
      throw new Error(message);
    }
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      if (!credentials.email || !credentials.password || !credentials.name) {
        throw new Error("Todos os campos são obrigatórios");
      }

      if (credentials.password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const firebaseUser = userCredential.user;

      const newUser: User = {
        uid: firebaseUser.uid,
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: credentials.role || "user",
      };

      // Remove campos undefined antes de salvar (Firestore não aceita undefined)
      const userDataToSave = removeUndefinedFields(
        newUser as unknown as Record<string, unknown>
      );

      // Salva no Firestore e aguarda confirmação
      await setDoc(doc(db, "users", firebaseUser.uid), userDataToSave);

      // Verifica se foi salvo corretamente
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error("Erro ao salvar usuário no banco de dados");
      }

      return newUser;
    } catch (error) {
      const message = getFirebaseErrorMessage(error as firebaseError | string);
      throw new Error(message);
    }
  },

  observeAuthState(callback: (user: User | null) => void): Unsubscribe {
    try {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Pequeno delay para garantir que o documento foi criado
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Usuário está logado, busca dados completos no Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = convertFirestoreUser(userDoc.data());
              callback(userData);
            } else {
              callback(null);
            }
          } catch {
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    } catch (error) {
      throw new Error("Erro ao observar estado de autenticação: " + error);
    }
  },
};
