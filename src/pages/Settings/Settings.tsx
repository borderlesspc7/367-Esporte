import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../contexts/NotificationContext";
import { settingsService } from "../../services/settingsService";
import { authService } from "../../services/authService";
import type { UserSettings } from "../../types/settings";
import { defaultSettings } from "../../types/settings";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import "./Settings.css";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      try {
        setLoadingSettings(true);
        const savedSettings = await settingsService.getSettings(user.uid);
        setSettings(savedSettings);
      } catch (error) {
        addNotification(
          "error",
          "Erro ao carregar",
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as configurações.",
        );
        // Usar configurações padrão em caso de erro
        setSettings(defaultSettings);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, [user, addNotification]);

  const handleToggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value as any }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await settingsService.saveSettings(user.uid, settings);
      addNotification(
        "success",
        "Configurações salvas",
        "Suas preferências foram atualizadas com sucesso!",
      );
    } catch (error) {
      addNotification(
        "error",
        "Erro ao salvar",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as configurações.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      addNotification(
        "error",
        "Campos obrigatórios",
        "Preencha todos os campos.",
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification(
        "error",
        "Senhas não coincidem",
        "As senhas não são iguais.",
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addNotification(
        "error",
        "Senha muito curta",
        "A senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      addNotification(
        "success",
        "Senha alterada",
        "Sua senha foi alterada com sucesso!",
      );
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      addNotification(
        "error",
        "Erro ao alterar senha",
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a senha.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loadingSettings) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#cbd5e1" }}
          >
            Carregando configurações...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <div className="settings-header-content">
            <SettingsIcon size={28} className="settings-header-icon" />
            <div>
              <h1 className="settings-title">Configurações</h1>
              <p className="settings-subtitle">Personalize sua experiência</p>
            </div>
          </div>
          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

        <div className="settings-content">
          {/* Notificações */}
          <div className="settings-section">
            <div className="settings-section-header">
              <Bell size={20} className="settings-section-icon" />
              <h2 className="settings-section-title">Notificações</h2>
            </div>
            <div className="settings-options">
              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Notificações por Email
                  </label>
                  <span className="settings-option-description">
                    Receba notificações importantes por email
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Notificações Push
                  </label>
                  <span className="settings-option-description">
                    Receba notificações em tempo real no navegador
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Atualizações de Projetos
                  </label>
                  <span className="settings-option-description">
                    Notifique-me sobre mudanças nos projetos
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.projectUpdates}
                    onChange={() => handleToggle("projectUpdates")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Alertas Financeiros
                  </label>
                  <span className="settings-option-description">
                    Receba alertas sobre movimentações financeiras
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.financialAlerts}
                    onChange={() => handleToggle("financialAlerts")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className="settings-section">
            <div className="settings-section-header">
              <Shield size={20} className="settings-section-icon" />
              <h2 className="settings-section-title">Privacidade</h2>
            </div>
            <div className="settings-options">
              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Visibilidade do Perfil
                  </label>
                  <span className="settings-option-description">
                    Quem pode ver seu perfil
                  </span>
                </div>
                <select
                  className="settings-select"
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    handleSelectChange("profileVisibility", e.target.value)
                  }
                >
                  <option value="public">Público</option>
                  <option value="private">Privado</option>
                  <option value="contacts">Apenas Contatos</option>
                </select>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">Mostrar Email</label>
                  <span className="settings-option-description">
                    Exibir seu email no perfil público
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={() => handleToggle("showEmail")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Mostrar Telefone
                  </label>
                  <span className="settings-option-description">
                    Exibir seu telefone no perfil público
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.showPhone}
                    onChange={() => handleToggle("showPhone")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Aparência */}
          <div className="settings-section">
            <div className="settings-section-header">
              <Palette size={20} className="settings-section-icon" />
              <h2 className="settings-section-title">Aparência</h2>
            </div>
            <div className="settings-options">
              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">Tema</label>
                  <span className="settings-option-description">
                    Escolha entre tema claro ou escuro
                  </span>
                </div>
                <div className="settings-theme-selector">
                  <button
                    className={`settings-theme-btn ${
                      settings.theme === "light" ? "active" : ""
                    }`}
                    onClick={() => handleSelectChange("theme", "light")}
                  >
                    <Sun size={18} />
                    Claro
                  </button>
                  <button
                    className={`settings-theme-btn ${
                      settings.theme === "dark" ? "active" : ""
                    }`}
                    onClick={() => handleSelectChange("theme", "dark")}
                  >
                    <Moon size={18} />
                    Escuro
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">Idioma</label>
                  <span className="settings-option-description">
                    Selecione o idioma da interface
                  </span>
                </div>
                <select
                  className="settings-select"
                  value={settings.language}
                  onChange={(e) =>
                    handleSelectChange("language", e.target.value)
                  }
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="settings-section">
            <div className="settings-section-header">
              <Shield size={20} className="settings-section-icon" />
              <h2 className="settings-section-title">Segurança</h2>
            </div>
            <div className="settings-options">
              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">
                    Autenticação de Dois Fatores
                  </label>
                  <span className="settings-option-description">
                    Adicione uma camada extra de segurança à sua conta
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle("twoFactorAuth")}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <label className="settings-option-label">Alterar Senha</label>
                  <span className="settings-option-description">
                    Atualize sua senha regularmente para manter sua conta segura
                  </span>
                </div>
                <button
                  className="settings-action-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alterar Senha */}
      {showPasswordModal && (
        <div
          className="settings-modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h3 className="settings-modal-title">Alterar Senha</h3>
              <button
                className="settings-modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="settings-modal-content">
              <div className="settings-form-group">
                <label className="settings-form-label">Senha Atual</label>
                <div className="settings-password-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className="settings-form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    className="settings-password-toggle"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="settings-form-group">
                <label className="settings-form-label">Nova Senha</label>
                <div className="settings-password-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className="settings-form-input"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    className="settings-password-toggle"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="settings-form-group">
                <label className="settings-form-label">
                  Confirmar Nova Senha
                </label>
                <div className="settings-password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    className="settings-form-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    className="settings-password-toggle"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="settings-modal-footer">
              <button
                className="settings-modal-cancel-btn"
                onClick={() => setShowPasswordModal(false)}
                disabled={changingPassword}
              >
                Cancelar
              </button>
              <button
                className="settings-modal-save-btn"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Settings };
