import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../contexts/NotificationContext";
import { User, Mail, Phone, Calendar, Save, Edit2, X, Camera } from "lucide-react";
import { authService } from "../../services/authService";
import "./Profile.css";

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPhotoPreview(user.photoURL || null);
    }
  }, [user]);


  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      setUploadingPhoto(true);

      // Criar preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload da foto
      const photoURL = await authService.uploadProfilePhoto(user.uid, file);

      // Deletar foto antiga se existir
      if (user.photoURL) {
        await authService.deleteProfilePhoto(user.photoURL);
      }

      // Atualizar perfil com nova foto
      const updatedUser = await authService.updateProfile(user.uid, { photoURL });
      updateUser(updatedUser);

      addNotification("success", "Foto atualizada", "Sua foto de perfil foi atualizada com sucesso!");
    } catch (error) {
      addNotification(
        "error",
        "Erro ao fazer upload",
        error instanceof Error ? error.message : "Não foi possível fazer upload da foto."
      );
      // Reverter preview em caso de erro
      setPhotoPreview(user.photoURL || null);
    } finally {
      setUploadingPhoto(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePhotoClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhone = (phone: string): string => {
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, "");
    
    // Formata: (XX) XXXXX-XXXX
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Formatar telefone enquanto digita
      const formatted = formatPhone(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validações
    if (!formData.name.trim()) {
      addNotification("error", "Nome obrigatório", "Por favor, informe seu nome.");
      return;
    }

    if (!formData.email.trim()) {
      addNotification("error", "Email obrigatório", "Por favor, informe seu email.");
      return;
    }

    if (!validateEmail(formData.email)) {
      addNotification("error", "Email inválido", "Por favor, informe um email válido.");
      return;
    }

    // Validar telefone se preenchido
    if (formData.phone && formData.phone.replace(/\D/g, "").length < 10) {
      addNotification("error", "Telefone inválido", "Por favor, informe um telefone válido.");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(user.uid, formData);
      updateUser(updatedUser);
      
      addNotification("success", "Perfil atualizado", "Suas informações foram salvas com sucesso!");
      setIsEditing(false);
    } catch (error) {
      addNotification(
        "error",
        "Erro ao atualizar",
        error instanceof Error ? error.message : "Não foi possível atualizar o perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPhotoPreview(user.photoURL || null);
    }
    setIsEditing(false);
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div 
              className={`profile-avatar-large ${photoPreview ? 'profile-avatar-with-photo' : ''}`}
              style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : undefined}
            >
              {!photoPreview && getInitials(user.name)}
            </div>
            {isEditing && (
              <button 
                className="profile-avatar-edit" 
                title="Alterar foto"
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <div className="profile-avatar-loading"></div>
                ) : (
                  <Camera size={16} />
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-header-info">
            <h1 className="profile-title">Meu Perfil</h1>
            <p className="profile-subtitle">Gerencie suas informações pessoais</p>
          </div>
          {!isEditing ? (
            <button
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={18} />
              Editar Perfil
            </button>
          ) : (
            <div className="profile-actions">
              <button
                className="profile-cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={18} />
                Cancelar
              </button>
              <button
                className="profile-save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <Save size={18} />
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2 className="profile-section-title">Informações Pessoais</h2>
            <div className="profile-form">
              <div className="profile-form-group">
                <label className="profile-label">
                  <User size={18} />
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Digite seu nome completo"
                  />
                ) : (
                  <div className="profile-value">{user.name}</div>
                )}
              </div>

              <div className="profile-form-group">
                <label className="profile-label">
                  <Mail size={18} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="Digite seu email"
                  />
                ) : (
                  <div className="profile-value">{user.email}</div>
                )}
              </div>

              <div className="profile-form-group">
                <label className="profile-label">
                  <Phone size={18} />
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="profile-input"
                    placeholder="(00) 00000-0000"
                  />
                ) : (
                  <div className="profile-value">
                    {user.phone || "Não informado"}
                  </div>
                )}
              </div>

              <div className="profile-form-group">
                <label className="profile-label">
                  <Calendar size={18} />
                  Membro desde
                </label>
                <div className="profile-value">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Informações da Conta</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">ID do Usuário</span>
                <span className="profile-info-value">{user.uid}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Função</span>
                <span className="profile-info-value">
                  {user.role === "admin" ? "Administrador" : "Usuário"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Última atualização</span>
                <span className="profile-info-value">
                  {new Date(user.updatedAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
