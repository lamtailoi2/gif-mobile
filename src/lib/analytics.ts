import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { ERROR_LOGS_COLLECTION, USER_EVENTS_COLLECTION } from "@/constants/collections";
import { Platform } from "react-native";

export const analyticsService = {
  /**
   * Log an error to Firebase Firestore error_logs collection.
   * This is designed to be fire-and-forget and safe from crashing the app.
   */
  async logError(
    error: Error | unknown,
    context: {
      screen: string;
      userId?: string;
      extra?: Record<string, unknown>;
    }
  ): Promise<void> {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const logData = {
      userId: context.userId || "anonymous",
      screen: context.screen,
      errorMessage: errorMsg,
      errorStack: errorStack || null,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      appVersion: "1.0.0", // Hardcoded or from constants/Expo updates if needed
      extra: context.extra || null,
    };

    // Print to console for development
    console.error(`[Analytics Error Log] [Screen: ${context.screen}]`, errorMsg, context.extra || "");

    try {
      await addDoc(collection(db, ERROR_LOGS_COLLECTION), logData);
    } catch (e) {
      console.warn("Failed to send error log to Firestore:", e);
    }
  },

  /**
   * Log a user event/behavior to Firebase Firestore user_events collection.
   */
  async logEvent(
    eventName: string,
    properties: {
      userId?: string;
      screen?: string;
      [key: string]: unknown;
    } = {}
  ): Promise<void> {
    const { userId, screen, ...rest } = properties;

    const eventData = {
      userId: userId || "anonymous",
      event: eventName,
      properties: rest,
      timestamp: new Date().toISOString(),
      screen: screen || "unknown",
      platform: Platform.OS,
    };

    console.log(`[Analytics Event Log] [Event: ${eventName}]`, eventData);

    try {
      await addDoc(collection(db, USER_EVENTS_COLLECTION), eventData);
    } catch (e) {
      console.warn("Failed to send event log to Firestore:", e);
    }
  }
};
