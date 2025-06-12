import { Notification, NotificationResult } from '../models/notification';

export interface IMessagingService {
  // Send to a specific device
  sendToDevice(notification: Notification): Promise<NotificationResult>;
  
  // Send to multiple devices
//   sendToDevices(notification: Notification, tokens: string[]): Promise<NotificationResult>;
  
  // Send to a topic
  sendToTopic(notification: Notification): Promise<NotificationResult>;
  
  // Subscribe tokens to a topic
  subscribeToTopic(tokens: string[], topic: string): Promise<boolean>;
  
  // Unsubscribe tokens from a topic
  unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean>;
}