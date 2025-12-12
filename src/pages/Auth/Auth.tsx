import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { LoginCredentials, RegisterCredentials } from "../../types/user";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import logo from "../../assets/logo_branca.png";
import "./Auth.css";

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterCredentials>({
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
  const { login, register } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login({ email: loginData.email, password: loginData.password });
      navigate("/dashboard");
    } catch (error) {
      setError("Falha ao fazer login. Verifique suas credenciais.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      navigate("/dashboard");
    } catch {
      setError("Falha ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <div className="auth-forms-wrapper">
          {/* LOGIN FORM */}
          <div
            className={`auth-form-container ${
              isLogin ? "active" : "inactive-left"
            }`}
          >
            <h2 className="auth-title-welcome">Bem vindo de volta!</h2>
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  required
                  placeholder="Digite seu email"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">
                  Senha
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                    disabled={loading}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Entrando..." : "Entrar"}
              </button>
              {error && isLogin && <p className="error-message">{error}</p>}
            </form>

            <div className="footer">
              <p>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="link-button"
                >
                  Registre-se
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="link-button"
                >
                  Esqueceu sua senha?
                </button>
              </p>
            </div>
          </div>

          {/* REGISTER FORM */}
          <div
            className={`auth-form-container ${
              !isLogin ? "active" : "inactive-right"
            }`}
          >
            <h2 className="auth-title-welcome">Crie sua conta</h2>
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="register-name" className="form-label">
                  Nome
                </label>
                <input
                  type="text"
                  id="register-name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterInputChange}
                  required
                  placeholder="Digite seu nome completo"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  required
                  placeholder="Digite seu email"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password" className="form-label">
                  Senha
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    required
                    disabled={loading}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label
                  htmlFor="register-confirmPassword"
                  className="form-label"
                >
                  Confirmar Senha
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="register-confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    required
                    disabled={loading}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
              {error && !isLogin && <p className="error-message">{error}</p>}
            </form>

            <div className="footer">
              <p>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="link-button"
                >
                  Faça login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
