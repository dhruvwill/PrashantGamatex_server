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
  ) {}

  initialize(): void {
    // PrashantGamatex notifications
    this.scheduleTask('0 9 * * *', this.sendQuotationFollowUpNotification.bind(this));
    this.scheduleTask('0 9 * * *', this.sendLeadFollowUpNotification.bind(this));
    
    // Ferber notifications
    this.scheduleTask('0 9 * * *', this.sendFerberQuotationFollowUpNotification.bind(this));
    this.scheduleTask('0 9 * * *', this.sendFerberLeadFollowUpNotification.bind(this));
    
    // WestPoint notifications
    this.scheduleTask('0 9 * * *', this.sendWestPointQuotationFollowUpNotification.bind(this));
    this.scheduleTask('0 9 * * *', this.sendWestPointLeadFollowUpNotification.bind(this));
    
    console.log('Notification scheduler initialized successfully for all companies');
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
      if (!knex) {
        console.error('Database connection not available for quotation reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllQuotationReminders);
      console.log(`Found ${data?.length || 0} quotation reminders`);
      
      if (!data || data.length === 0) {
        console.log('No quotation reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping quotation reminder with missing company name, ID: ${reminder.QuotationNumber || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'Quotation Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'quotation_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              QuotationId: reminder.QuotationNumber,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`);
          } else {
            failureCount++;
            console.error(`Failed to send quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing quotation reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`Quotation notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in quotation follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  private async sendLeadFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('PrashantGamatex');
      if (!knex) {
        console.error('Database connection not available for lead reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllLeadReminders);
      console.log(`Found ${data?.length || 0} lead reminders`);
      
      if (!data || data.length === 0) {
        console.log('No lead reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping lead reminder with missing company name, ID: ${reminder.LeadId || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'Lead Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'lead_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              LeadId: reminder.LeadId,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent lead follow-up notification for lead ID: ${reminder.LeadId}`);
          } else {
            failureCount++;
            console.error(`Failed to send lead follow-up notification for lead ID: ${reminder.LeadId}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing lead reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`Lead notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in lead follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  // Ferber Company Notifications
  private async sendFerberQuotationFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('Ferber');
      if (!knex) {
        console.error('Database connection not available for Ferber quotation reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllQuotationReminders);
      console.log(`Found ${data?.length || 0} Ferber quotation reminders`);
      
      if (!data || data.length === 0) {
        console.log('No Ferber quotation reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping Ferber quotation reminder with missing company name, ID: ${reminder.QuotationNumber || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'Ferber Quotation Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'ferber_quotation_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              QuotationId: reminder.QuotationNumber,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent Ferber quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`);
          } else {
            failureCount++;
            console.error(`Failed to send Ferber quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing Ferber quotation reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`Ferber quotation notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in Ferber quotation follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  private async sendFerberLeadFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('Ferber');
      if (!knex) {
        console.error('Database connection not available for Ferber lead reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllLeadReminders);
      console.log(`Found ${data?.length || 0} Ferber lead reminders`);
      
      if (!data || data.length === 0) {
        console.log('No Ferber lead reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping Ferber lead reminder with missing company name, ID: ${reminder.LeadId || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'Ferber Lead Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'ferber_lead_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              LeadId: reminder.LeadId,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent Ferber lead follow-up notification for lead ID: ${reminder.LeadId}`);
          } else {
            failureCount++;
            console.error(`Failed to send Ferber lead follow-up notification for lead ID: ${reminder.LeadId}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing Ferber lead reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`Ferber lead notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in Ferber lead follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  // WestPoint Company Notifications
  private async sendWestPointQuotationFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('WestPoint');
      if (!knex) {
        console.error('Database connection not available for WestPoint quotation reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllQuotationReminders);
      console.log(`Found ${data?.length || 0} WestPoint quotation reminders`);
      
      if (!data || data.length === 0) {
        console.log('No WestPoint quotation reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping WestPoint quotation reminder with missing company name, ID: ${reminder.QuotationNumber || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'WestPoint Quotation Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'westpoint_quotation_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              QuotationId: reminder.QuotationNumber,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent WestPoint quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`);
          } else {
            failureCount++;
            console.error(`Failed to send WestPoint quotation follow-up notification for quotation ID: ${reminder.QuotationNumber}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing WestPoint quotation reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`WestPoint quotation notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in WestPoint quotation follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  private async sendWestPointLeadFollowUpNotification(): Promise<void> {
    try {
      const knex = getKnexInstance('WestPoint');
      if (!knex) {
        console.error('Database connection not available for WestPoint lead reminders');
        return;
      }

      const data = await knex.raw(CRM_GetAllLeadReminders);
      console.log(`Found ${data?.length || 0} WestPoint lead reminders`);
      
      if (!data || data.length === 0) {
        console.log('No WestPoint lead reminders found to send notifications');
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const reminder of data) {
        try {
          if (!reminder.CompanyName) {
            console.warn(`Skipping WestPoint lead reminder with missing company name, ID: ${reminder.LeadId || 'unknown'}`);
            continue;
          }

          const token = reminder.FcmToken || 'ExponentPushToken[aYSDJfPyrtsuByOOyp_OmW]';
          const notification: Notification = {
            token,
            title: 'WestPoint Lead Follow-Up Reminder',
            body: `Reminder for company: ${reminder.CompanyName} on ${new Date(reminder.NextVisitDateTime).toLocaleDateString()}`,
            data: {
              type: 'westpoint_lead_reminder',
              reminderDate: reminder.NextVisitDateTime,
              companyName: reminder.CompanyName,
              followupDetails: reminder.FollowupDetails,
              modeOfContact: reminder.ModeofContact,
              UserName: reminder.UserIdentification,
              UserId: reminder.UserCode,
              LeadId: reminder.LeadId,
            },
          };
          
          const result = await this.messagingService.sendToDevice(notification);
          if (result.success) {
            successCount++;
            console.log(`Successfully sent WestPoint lead follow-up notification for lead ID: ${reminder.LeadId}`);
          } else {
            failureCount++;
            console.error(`Failed to send WestPoint lead follow-up notification for lead ID: ${reminder.LeadId}`, result.error || '');
          }
        } catch (reminderError) {
          failureCount++;
          console.error(`Error processing WestPoint lead reminder for ${reminder.CompanyName || 'unknown company'}:`, reminderError);
        }
      }
      
      console.log(`WestPoint lead notifications summary: ${successCount} sent successfully, ${failureCount} failed`);
    } catch (error) {
      console.error('Error in WestPoint lead follow-up notification process:', error instanceof Error ? error.message : error);
      console.debug('Error details:', error);
    }
  }

  stopAllTasks(): void {
    this.scheduledTasks.forEach(task => task.stop());
    this.scheduledTasks = [];
    console.log('All scheduled notification tasks stopped');
  }
}