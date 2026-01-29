import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import type { UserSettings } from "../types/settings";
import { defaultSettings } from "../types/settings";
import getFirebaseErrorMessage from "../components/ui/ErrorMessage";

interface firebaseError {
  code?: string;
  message?: string;
}

export const settingsService = {
  async getSettings(uid: string): Promise<UserSettings> {
    try {
      const settingsDoc = await getDoc(doc(db, "users", uid, "settings", "preferences"));
      
      if (settingsDoc.exists()) {
        return settingsDoc.data() as UserSettings;
      }
      
      // Retornar configurações padrão se não existir
      return defaultSettings;
    } catch (error) {
      const message = getFirebaseErrorMessage(error as firebaseError | string);
      throw new Error(`Erro ao carregar configurações: ${message}`);
    }
  },

  async saveSettings(uid: string, settings: UserSettings): Promise<void> {
    try {
      await setDoc(
        doc(db, "users", uid, "settings", "preferences"),
        {
          ...settings,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      const message = getFirebaseErrorMessage(error as firebaseError | string);
      throw new Error(`Erro ao salvar configurações: ${message}`);
    }
  },
};
