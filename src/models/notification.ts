export interface NotificationData {
  [key: string]: string;
}

export interface Notification {
  title: string;
  body: string;
  token?: string;  // For single device
  topic?: string;  // For topic-based messaging
  data?: Record<string, string>;  // Additional data payload
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

export interface ScheduleNotificationParams {
  notification: Notification;
  scheduleTime: Date;
}