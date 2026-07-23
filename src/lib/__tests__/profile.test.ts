import { EExperienceLevel, EFitnessGoal, EGender } from '@/constants/profile.constant';
import { getNextOnboardingStep, getUserProfile, isOnboarded, isProfileComplete } from '../profile';

describe('profile helpers', () => {
  it('returns empty metadata for missing users', () => {
    expect(getUserProfile(null)).toEqual({});
  });

  it('detects complete profile data', () => {
    const user = {
      firstName: 'Tai',
      lastName: 'Lam',
      unsafeMetadata: {
        gender: EGender.Male,
        dateOfBirth: '2000-01-01',
        weightKg: 70,
        heightCm: 175,
      },
    };

    expect(isProfileComplete(user)).toBe(true);
  });

  it('detects onboarded users by flag or goal and level', () => {
    expect(isOnboarded({ unsafeMetadata: { onboarded: true } })).toBe(true);
    expect(isOnboarded({ unsafeMetadata: { goal: EFitnessGoal.BuildMuscle, level: EExperienceLevel.Beginner } })).toBe(true);
    expect(isOnboarded({ unsafeMetadata: { goal: EFitnessGoal.BuildMuscle } })).toBe(false);
  });

  it('returns the next onboarding step', () => {
    expect(getNextOnboardingStep(null)).toBe('profile');
    expect(
      getNextOnboardingStep({
        firstName: 'Tai',
        lastName: 'Lam',
        unsafeMetadata: {
          gender: EGender.Male,
          dateOfBirth: '2000-01-01',
          weightKg: 70,
          heightCm: 175,
        },
      }),
    ).toBe('goal');
    expect(getNextOnboardingStep({ unsafeMetadata: { onboarded: true } })).toBeNull();
  });
});
