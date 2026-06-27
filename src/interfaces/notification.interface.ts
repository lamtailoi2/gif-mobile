export enum ENotificationType {
  WorkoutReminder = "workout_reminder",
  StreakWarning = "streak_warning",
  AiPlanReady = "ai_plan_ready",
  SystemInfo = "system_info",
}

export interface INotification {
  id: string;               // Firestore doc ID or unique local ID
  userId: string;
  title: string;
  body: string;
  type: ENotificationType;
  isRead: boolean;
  createdAt: string;        // ISO string
  data?: Record<string, string>; // deep link or navigation metadata
}
