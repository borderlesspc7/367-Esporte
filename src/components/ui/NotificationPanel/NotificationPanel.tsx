import React from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, CheckCheck, Bell } from "lucide-react";
import { useNotifications } from "../../../contexts/NotificationContext";
import type { Notification } from "../../../types/notification";
import { useNavigate } from "react-router-dom";
import "./NotificationPanel.css";

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="notification-icon-success" />;
      case "error":
        return <AlertCircle size={18} className="notification-icon-error" />;
      case "warning":
        return <AlertTriangle size={18} className="notification-icon-warning" />;
      case "info":
        return <Info size={18} className="notification-icon-info" />;
      default:
        return <Info size={18} className="notification-icon-info" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  return (
    <div className="notification-panel-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-panel-header">
          <div className="notification-panel-title">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <span className="notification-panel-badge">{unreadCount}</span>
            )}
          </div>
          <div className="notification-panel-actions">
            {unreadCount > 0 && (
              <button
                className="notification-action-btn"
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
              >
                <CheckCheck size={18} />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="notification-action-btn"
                onClick={clearAllNotifications}
                title="Limpar todas"
              >
                Limpar
              </button>
            )}
            <button
              className="notification-close-btn"
              onClick={onClose}
              aria-label="Fechar painel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="notification-panel-content">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={48} className="notification-empty-icon" />
              <p>Nenhuma notificação</p>
              <span>Você está em dia!</span>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-item-icon">
                    {getIcon(notification.type)}
                  </div>
                  <div className="notification-item-content">
                    <div className="notification-item-header">
                      <h4 className="notification-item-title">{notification.title}</h4>
                      {!notification.read && <div className="notification-dot"></div>}
                    </div>
                    <p className="notification-item-message">{notification.message}</p>
                    <span className="notification-item-time">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <button
                    className="notification-item-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    aria-label="Remover notificação"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Função para formatar tempo relativo
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
};
