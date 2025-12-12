import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  BarChart3,
  DollarSign,
  FolderKanban,
  LayoutDashboard,
  FileText,
  TrendingUp,
} from "lucide-react";

interface SidebarItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
  color?: string;
}

const items: SidebarItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard />,
    color: "#646cff",
  },
  {
    path: "/projetos",
    label: "Projetos",
    icon: <FolderKanban />,
    badge: "12",
    color: "#10b981",
  },
  {
    path: "/meta-fisica",
    label: "Meta Física",
    icon: <TrendingUp />,
    color: "#f59e0b",
  },
  {
    path: "/financeiro",
    label: "Financeiro",
    icon: <DollarSign />,
    color: "#8b5cf6",
  },
  {
    path: "/relatorios",
    label: "Relatórios",
    icon: <FileText />,
    color: "#06b6d4",
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Menu Principal</h3>
          <ul className="sidebar-list">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="sidebar-item">
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    style={
                      isActive
                        ? {
                            "--active-color": item.color,
                          } as React.CSSProperties
                        : undefined
                    }
                  >
                    <div className="sidebar-link-content">
                      {item.icon && (
                        <span
                          className="sidebar-icon"
                          style={
                            isActive
                              ? { color: item.color }
                              : undefined
                          }
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="sidebar-label">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="sidebar-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="stat-item">
              <BarChart3 size={16} />
              <div className="stat-content">
                <span className="stat-value">85%</span>
                <span className="stat-label">Progresso</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};
