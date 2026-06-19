import type { EExperienceLevel, EFitnessGoal, EGender } from '@/constants/profile.constant';
import '@clerk/types';

declare module '*.module.css';
declare module '*.css';

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    EXPO_PUBLIC_FIREBASE_API_KEY?: string;
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID?: string;
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
    EXPO_PUBLIC_FIREBASE_APP_ID?: string;
  }
}

declare module '@clerk/types' {
  interface UserResource {
    unsafeMetadata: {
      gender?: EGender;
      dateOfBirth?: string;
      weightKg?: number;
      heightCm?: number;
      goal?: EFitnessGoal;
      level?: EExperienceLevel;
      daysPerWeek?: number;
      onboarded?: boolean;
    };
  }
}
