import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { Notification } from "../../../types/notification";
import "./Toast.css";

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle2 size={20} className="toast-icon-success" />;
      case "error":
        return <AlertCircle size={20} className="toast-icon-error" />;
      case "warning":
        return <AlertTriangle size={20} className="toast-icon-warning" />;
      case "info":
        return <Info size={20} className="toast-icon-info" />;
      default:
        return <Info size={20} className="toast-icon-info" />;
    }
  };

  return (
    <div className={`toast toast-${notification.type}`}>
      <div className="toast-content">
        <div className="toast-icon-wrapper">{getIcon()}</div>
        <div className="toast-text">
          <div className="toast-title">{notification.title}</div>
          <div className="toast-message">{notification.message}</div>
        </div>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(notification.id)}
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
};
