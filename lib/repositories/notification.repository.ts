import { Notification, NotificationType } from "@/types/notification";

export class NotificationRepository {
  private mockNotifications: Notification[] = [
    {
      id: "n-1",
      title: "Booking Confirmed",
      message: "Your care visit schedule has been accepted.",
      read: false,
      createdAt: new Date().toISOString(),
      type: NotificationType.Booking,
    },
    {
      id: "n-2",
      title: "Vitals Update",
      message: "Please log today's diagnostic records.",
      read: true,
      createdAt: new Date().toISOString(),
      type: NotificationType.Reminder,
    },
  ];

  async getNotifications(): Promise<Notification[]> {
    return this.mockNotifications;
  }
}

export const notificationRepository = new NotificationRepository();
