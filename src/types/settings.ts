export interface UserSettings {
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  financialAlerts: boolean;
  // Privacidade
  profileVisibility: "public" | "private" | "contacts";
  showEmail: boolean;
  showPhone: boolean;
  // Aparência
  theme: "light" | "dark";
  language: "pt-BR" | "en-US" | "es-ES";
  // Segurança
  twoFactorAuth: boolean;
}

export const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  projectUpdates: true,
  financialAlerts: true,
  profileVisibility: "public",
  showEmail: true,
  showPhone: false,
  theme: "dark",
  language: "pt-BR",
  twoFactorAuth: false,
};
