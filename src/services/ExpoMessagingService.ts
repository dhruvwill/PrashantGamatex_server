import { Expo } from 'expo-server-sdk';
import expo from '../config/expo';
import { Notification, NotificationResult } from '../models/notification';
import { IMessagingService } from '../interfaces/IMessagingService';

export class ExpoPushNotificationService implements IMessagingService {
  async sendToDevice(notification: Notification): Promise<NotificationResult> {
    // Validate the token
    if (!Expo.isExpoPushToken(notification.token)) {
      console.error(`Invalid Expo push token: ${notification.token}`);
      return {
        success: false,
        error: 'Invalid Expo push token'
      };
    }

    // Create the message
    const message = {
      to: notification.token,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    };

    try {
      // Send the message
      const ticketChunk = await expo.sendPushNotificationsAsync([message]);
      const ticket = ticketChunk[0];
      
      if (ticket.status === 'error') {
        console.error(`Error sending notification: ${ticket.message}`);
        return {
          success: false,
          error: ticket.message,
        };
      }
      
      return {
        success: true,
        messageId: ticket.id
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return {
        success: false,
        error: 'Failed to send notification'
      };
    }
  }
}