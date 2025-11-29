export interface ISchedulerService {
  /**
   * Initializes the scheduler service
   */
  initialize(): void;
  
  /**
   * Schedules a task to run at specified intervals
   * @param cronExpression The cron expression that defines when to run the task
   * @param task The task function to run
   */
  scheduleTask(cronExpression: string, task: () => Promise<void>): void;
  
  /**
   * Stops all scheduled tasks
   */
  stopAllTasks(): void;
}