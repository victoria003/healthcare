export enum NotificationType {
  Booking = "Booking",
  Reminder = "Reminder",
  System = "System",
  Promotion = "Promotion",
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
}
