import { EExperienceLevel, EFitnessGoal, EGender } from "@/constants/profile.constant";
import { IUserProfile } from "@/interfaces/profile.interface";

/** Shape tối thiểu của Clerk user mà các guard cần đọc. */
type ClerkUserLike = {
  firstName?: string | null;
  lastName?: string | null;
  unsafeMetadata?: unknown;
} | null | undefined;

/** Bước onboarding tiếp theo user cần hoàn tất (null = đã xong hết). */
export type OnboardingStep = 'profile' | 'goal' | null;

/** Đọc profile từ unsafeMetadata của Clerk user (an toàn với null). */
export function getUserProfile(user: ClerkUserLike): IUserProfile {
  return (user?.unsafeMetadata ?? {}) as IUserProfile;
}

/**
 * Đã hoàn tất bước thông tin cá nhân/cơ thể chưa.
 * Cần đủ first/last name (field native Clerk) + gender + dateOfBirth + cân nặng + chiều cao.
 */
export function isProfileComplete(user: ClerkUserLike): boolean {
  const p = getUserProfile(user);
  return Boolean(
    user?.firstName &&
      user?.lastName &&
      p.gender &&
      p.dateOfBirth &&
      p.weightKg &&
      p.heightCm,
  );
}

/**
 * User đã hoàn tất onboarding chưa.
 * Coi là xong nếu có cờ `onboarded`, HOẶC đã có sẵn goal + level
 * (vd data cũ / login Google trước đó) -> vào thẳng home, không bắt setup lại.
 */
export function isOnboarded(user: ClerkUserLike): boolean {
  const p = getUserProfile(user);
  return Boolean(p.onboarded || (p.goal && p.level));
}

/** Bước onboarding còn thiếu để guard redirect đúng chỗ. */
export function getNextOnboardingStep(user: ClerkUserLike): OnboardingStep {
  if (isOnboarded(user)) return null;
  if (!isProfileComplete(user)) return 'profile';
  return 'goal';
}

export const GOAL_OPTIONS: {
  value: EFitnessGoal;
  label: string;
  desc: string;
  icon: string;
}[] = [
  { value: EFitnessGoal.LoseWeight, label: 'Lose Weight', desc: 'Burn fat, get lean', icon: 'local-fire-department' },
  { value: EFitnessGoal.BuildMuscle, label: 'Build Muscle', desc: 'Gain size & mass', icon: 'fitness-center' },
  { value: EFitnessGoal.ImproveEndurance, label: 'Endurance', desc: 'Boost stamina & cardio', icon: 'directions-run' },
  { value: EFitnessGoal.GeneralFitness, label: 'Stay Fit', desc: 'Overall health', icon: 'favorite' },
];

export const GENDER_OPTIONS: { value: EGender; label: string; icon: string }[] = [
  { value: EGender.Male, label: 'Male', icon: 'male' },
  { value: EGender.Female, label: 'Female', icon: 'female' },
  { value: EGender.Other, label: 'Other', icon: 'transgender' },
];

export const LEVEL_OPTIONS: { value: EExperienceLevel; label: string; desc: string }[] = [
  { value: EExperienceLevel.Beginner, label: 'Beginner', desc: 'New to training' },
  { value: EExperienceLevel.Intermediate, label: 'Intermediate', desc: '6+ months experience' },
  { value: EExperienceLevel.Advanced, label: 'Advanced', desc: '2+ years experience' },
];

export const DAYS_OPTIONS = [2, 3, 4, 5, 6] as const;
