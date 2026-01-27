import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { MailIcon, ArrowLeftIcon, CheckCircleIcon, LoaderIcon } from "lucide-react";
import logo from "../../assets/logo_branca__1_-removebg-preview.png";
import "./ForgotPassword.css";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError("Por favor, informe seu email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, informe um email válido.");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao enviar email de recuperação. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {!success ? (
          <>
            <div className="forgot-password-header">
              <div className="icon-wrapper">
                <MailIcon className="mail-icon" />
              </div>
              <h2 className="forgot-password-title">Recuperar Senha</h2>
              <p className="forgot-password-subtitle">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <MailIcon className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu email"
                    disabled={loading}
                    className={error ? "input-error" : ""}
                  />
                </div>
              </div>

              {error && (
                <div className="error-message-container">
                  <p className="error-message">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="forgot-password-button"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="button-loader" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </button>
            </form>

            <div className="forgot-password-footer">
              <Link to="/login" className="back-link">
                <ArrowLeftIcon className="back-icon" />
                Voltar para o login
              </Link>
            </div>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon-wrapper">
              <CheckCircleIcon className="success-icon" />
            </div>
            <h2 className="success-title">Email Enviado!</h2>
            <p className="success-message">
              Enviamos um link de recuperação para{" "}
              <strong className="success-email">{email}</strong>
            </p>
            <p className="success-instructions">
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha. Se não encontrar o email, verifique também a pasta de spam.
            </p>
            <div className="success-actions">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="resend-button"
              >
                Enviar Novamente
              </button>
              <Link to="/login" className="back-to-login-button">
                Voltar para o Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
