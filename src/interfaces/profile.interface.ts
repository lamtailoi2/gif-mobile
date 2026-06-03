import { EExperienceLevel, EFitnessGoal, EGender } from "@/constants/profile.constant";

export interface IUserProfile {
    // Thông tin cá nhân/cơ thể (first/last name dùng field native của Clerk).
    gender?: EGender;
    dateOfBirth?: string; // ISO YYYY-MM-DD
    weightKg?: number;
    heightCm?: number;
    // Goals
    goal?: EFitnessGoal;
    level?: EExperienceLevel;
    daysPerWeek?: number;
    onboarded?: boolean;
}