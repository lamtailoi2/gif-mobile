import { EExperienceLevel, EFitnessGoal } from '@/constants/profile.constant';
import type { IUserProfile } from '@/interfaces/profile.interface';
import { getUserProfile } from '@/lib/profile';
import { create } from 'zustand';
import { fromIsoDate, type ProfileForm } from '../libs/schema';

type ClerkUserLike =
  | { firstName?: string | null; lastName?: string | null; unsafeMetadata?: IUserProfile }
  | null
  | undefined;

type GoalsPatch = Partial<{ goal: EFitnessGoal; level: EExperienceLevel; daysPerWeek: number }>;

interface IOnboardingDraftStore {
  hydrated: boolean;
  profile: ProfileForm; 
  goal?: EFitnessGoal;
  level?: EExperienceLevel;
  daysPerWeek: number;
  /** Nạp nháp ban đầu từ Clerk user (chỉ chạy 1 lần mỗi lần vào onboarding). */
  hydrateFromUser: (user: ClerkUserLike) => void;
  /** Lưu nháp bước 1 (gọi khi rời bước 1). */
  setProfileDraft: (profile: ProfileForm) => void;
  /** Lưu nháp bước 2 (gọi mỗi khi đổi lựa chọn). */
  patchGoalsDraft: (patch: GoalsPatch) => void;
  /** Xoá nháp khi rời khỏi flow onboarding. */
  reset: () => void;
}

const EMPTY_PROFILE = {
  firstName: '',
  lastName: '',
  gender: undefined,
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  weightKg: '',
  heightCm: '',
} as unknown as ProfileForm;

const initialState = {
  hydrated: false,
  profile: EMPTY_PROFILE,
  goal: undefined,
  level: undefined,
  daysPerWeek: 3,
};

/**
 * Giữ nháp onboarding (global, zustand) để chuyển qua lại giữa 2 bước không mất
 * state. Chỉ commit lên Clerk ở các mốc rõ ràng (cuối bước 1: profile; cuối bước
 * 2: goals + onboarded). Layout (onboarding) hydrate khi vào và reset khi rời.
 */
export const useOnboardingDraftStore = create<IOnboardingDraftStore>((set, get) => ({
  ...initialState,
  hydrateFromUser: (user) => {
    if (get().hydrated) return;
    const p = getUserProfile(user);
    const dob = fromIsoDate(p.dateOfBirth);
    set({
      hydrated: true,
      profile: {
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        gender: p.gender,
        birthDay: dob.day,
        birthMonth: dob.month,
        birthYear: dob.year,
        weightKg: p.weightKg ? String(p.weightKg) : '',
        heightCm: p.heightCm ? String(p.heightCm) : '',
      } as ProfileForm,
      goal: p.goal,
      level: p.level,
      daysPerWeek: p.daysPerWeek ?? 3,
    });
  },
  setProfileDraft: (profile) => set({ profile }),
  patchGoalsDraft: (patch) => set(patch),
  reset: () => set(initialState),
}));
