import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  DollarSign,
  FolderKanban,
  LayoutDashboard,
  FileText,
  TrendingUp,
  TrafficCone,
} from "lucide-react";
import { paths } from "../../../routes/paths";

interface SidebarItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
  color?: string;
}

const items: SidebarItem[] = [
  {
    path: paths.dashboard,
    label: "Dashboard",
    icon: <LayoutDashboard />,
    color: "#646cff",
  },
  {
    path: paths.projects,
    label: "Projetos",
    icon: <FolderKanban />,
    color: "#10b981",
  },
  {
    path: paths.goals,
    label: "Meta Física",
    icon: <TrendingUp />,
    color: "#f59e0b",
  },
  {
    path: "/sinaleiras",
    label: "Sinaleiras",
    icon: <TrafficCone />,
    color: "#8b5cf6",
  },
  {
    path: paths.financial,
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
                        ? ({
                            "--active-color": item.color,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <div className="sidebar-link-content">
                      {item.icon && (
                        <span
                          className="sidebar-icon"
                          style={isActive ? { color: item.color } : undefined}
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

        <div className="sidebar-footer"></div>
      </nav>
    </aside>
  );
};
