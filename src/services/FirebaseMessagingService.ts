import { firebaseAdmin } from '../config/firebase';
import { IMessagingService } from '../interfaces/IMessagingService';
import { Notification, NotificationResult } from '../models/notification';

export class FirebaseMessagingService implements IMessagingService {
  private messaging = firebaseAdmin.messaging();

  async sendToDevice(notification: Notification): Promise<NotificationResult> {
    try {
      if (!notification.token) {
        throw new Error('FCM token is required to send to a device');
      }

      const message = {
        token: notification.token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
      };

      const response = await this.messaging.send(message);
      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('Error sending notification to device:', error);
      return {
        success: false,
        error,
      };
    }
  }

  async sendToTopic(notification: Notification): Promise<NotificationResult> {
    try {
      if (!notification.topic) {
        throw new Error('Topic is required to send to a topic');
      }

      const message = {
        topic: notification.topic,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
      };

      const response = await this.messaging.send(message);
      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('Error sending notification to topic:', error);
      return {
        success: false,
        error,
      };
    }
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    try {
      await this.messaging.subscribeToTopic(tokens, topic);
      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    try {
      await this.messaging.unsubscribeFromTopic(tokens, topic);
      return false;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }
}