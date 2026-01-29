export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
};
