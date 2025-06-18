import * as cron from 'node-cron';
import { ISchedulerService } from '../interfaces/ISchedulerService';
import { IMessagingService } from '../interfaces/IMessagingService';
import { Notification } from '../models/notification';
import { getKnexInstance } from '../db';
import { CRM_GetAllQuotationReminders } from '../queries/followup';
import { CRM_GetAllLeadReminders } from '../queries/lead';

export class NotificationSchedulerService implements ISchedulerService {
  private scheduledTasks: cron.ScheduledTask[] = [];

  constructor(
    private messagingService: IMessagingService,
  ) { }

  initialize(): void {
    // Example: Schedule a daily notification at 9:00 AM
    this.scheduleTask('0 9 * * *', this.sendHelloWorldNotification.bind(this));
    // this.scheduleTask('* * * * *', this.sendQuotationFollowUpNotification.bind(this));
    // this.scheduleTask('* * * * *', this.sendLeadFollowUpNotification.bind(this));
    console.log('Notification scheduler initialized successfully');
  }

  scheduleTask(cronExpression: string, task: () => Promise<void>): void {
    const scheduledTask = cron.schedule(cronExpression, async () => {
      try {
        await task();
      } catch (error) {
        console.error('Error executing scheduled task:', error);
      }
    });

    this.scheduledTasks.push(scheduledTask);
  }

  private async sendQuotationFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('PrashantGamatex');
      const data = await knex.raw(
        CRM_GetAllQuotationReminders
      );
      console.log('Quotation reminders data:', data);
    } catch (error) {
      console.error('Error sending quotation follow-up notification:', error);
    }
  }

  private async sendLeadFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('PrashantGamatex');
      const data = await knex.raw(
        CRM_GetAllLeadReminders
      );
      console.log('Lead reminders data:', data);
      // if (data && data.length > 0) {
      //   for (const reminder of data) {
      //     const notification: Notification = {
      //       token: reminder.token, // Assuming the token is part of the reminder data
      //       title: 'Lead Follow-Up Reminder',
      //       body: `Reminder for lead: ${reminder.leadName} on ${reminder.reminderDate}`,
      //       data: {
      //         type: 'lead_reminder',
      //         leadId: reminder.leadId,
      //         reminderDate: reminder.reminderDate,
      //       },
      //     };
      //     const result = await this.messagingService.sendToDevice(notification);
      //     if (result.success) {
      //       console.log(`Successfully sent lead follow-up notification for lead ID: ${reminder.leadId}`);
      //     } else {
      //       console.error(`Failed to send lead follow-up notification for lead ID: ${reminder.leadId}`);
      //     }
      //   }
      // } else {
      //   console.log('No lead reminders found to send notifications');
      // }
    } catch (error) {
      console.error('Error sending lead follow-up notification:', error);
    }
  }

  private async sendHelloWorldNotification(): Promise<void> {
    try {
      console.log('Sending Hello World notification...');

      // You would replace this with your token retrieval logic
      const targetToken = 'dW08AjQY_dWgFDkzPoWWon:APA91bFhLMdK0_dXCgzpZXnLMra5ZvK7yB6PhFH-3mFB2w1JEXzEWED3MopcJjpscPpO3HM-kCkGfh0Kc13OmHGXCkKkQc2CxiLSYRgDKgjKyWTdkt3Jeh8'; // This is a placeholder

      const notification: Notification = {
        token: targetToken,
        title: 'Hello World!',
        body: 'This is a scheduled notification',
        data: {
          type: 'scheduled',
          timestamp: new Date().toISOString()
        },
      };

      const result = await this.messagingService.sendToDevice(notification);

      if (result.success) {
        console.log('Successfully sent Hello World notification');
      } else {
        console.error('Failed to send Hello World notification');
      }
    } catch (error) {
      console.error('Error sending Hello World notification:', error);
    }
  }

  stopAllTasks(): void {
    this.scheduledTasks.forEach(task => task.stop());
    this.scheduledTasks = [];
    console.log('All scheduled notification tasks stopped');
  }
}