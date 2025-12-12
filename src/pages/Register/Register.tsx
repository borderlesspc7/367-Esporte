import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterCredentials } from "../../types/user";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import logo from "../../assets/logo_branca.png";
import "./Register.css";

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validação de senhas
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Falha ao criar conta. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <h2 className="register-title-welcome">Crie sua conta</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Digite seu nome completo"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Digite seu email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="********"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="********"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Esconder senha" : "Mostrar senha"
                }
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="register-button">
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="footer">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
