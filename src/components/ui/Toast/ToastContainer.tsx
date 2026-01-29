import React from "react";
import { Toast } from "./Toast";
import { useNotifications } from "../../../contexts/NotificationContext";
import "./Toast.css";

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // Mostrar apenas as últimas 5 notificações
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="toast-container">
      {recentNotifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
