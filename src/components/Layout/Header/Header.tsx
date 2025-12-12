import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { LogOut, User, ChevronDown, Settings, Bell } from "lucide-react";
import logo from "../../../assets/logo_branca.png";
import "./Header.css";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gerar iniciais do usuário
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-brand">
          <img
            src={logo}
            alt="Vagner Silva - Projetos Esportivos"
            className="header-logo"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notificações */}
        <button className="header-icon-btn" title="Notificações">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* Perfil do usuário */}
        {user && (
          <div className="header-user-menu" ref={dropdownRef}>
            <button
              className="user-profile-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                {user.email && <span className="user-email">{user.email}</span>}
              </div>
              <ChevronDown
                size={16}
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-user-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{user.name}</span>
                    <span className="dropdown-user-email">{user.email}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-items">
                  <button className="dropdown-item">
                    <User size={16} />
                    <span>Meu Perfil</span>
                  </button>
                  <button className="dropdown-item">
                    <Settings size={16} />
                    <span>Configurações</span>
                  </button>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item logout-item"
                  onClick={onLogout}
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
