import React from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { authService } from "../../services/authService";
import "./Layout.css";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await authService.logOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };
  return (
    <div className="layout-container">
      <Header onLogout={onLogout} />
      <div className="layout-content">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
};
