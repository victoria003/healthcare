import { notificationRepository } from "../repositories/notification.repository";
import { Notification } from "@/types/notification";

export class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    return notificationRepository.getNotifications();
  }
}

export const notificationService = new NotificationService();
