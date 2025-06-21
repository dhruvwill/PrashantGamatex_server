import { Notification, NotificationResult } from '../models/notification';

export interface IMessagingService {
  // Send to a specific device
  sendToDevice(notification: Notification): Promise<NotificationResult>;
}