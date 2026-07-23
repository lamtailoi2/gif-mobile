import { EExperienceLevel, EFitnessGoal, EGender } from '@/constants/profile.constant';
import { useOnboardingDraftStore } from '../use-onboarding-draft-store';

describe('useOnboardingDraftStore', () => {
  beforeEach(() => {
    useOnboardingDraftStore.getState().reset();
  });

  it('hydrates once from a Clerk-like user', () => {
    const user = {
      firstName: 'Tai',
      lastName: 'Lam',
      unsafeMetadata: {
        gender: EGender.Male,
        dateOfBirth: '2000-07-03',
        weightKg: 70,
        heightCm: 175,
        goal: EFitnessGoal.BuildMuscle,
        level: EExperienceLevel.Intermediate,
        daysPerWeek: 4,
      },
    };

    useOnboardingDraftStore.getState().hydrateFromUser(user);
    useOnboardingDraftStore.getState().hydrateFromUser({ firstName: 'Other', lastName: 'User' });

    expect(useOnboardingDraftStore.getState()).toMatchObject({
      hydrated: true,
      profile: {
        firstName: 'Tai',
        lastName: 'Lam',
        gender: EGender.Male,
        birthDay: '3',
        birthMonth: '7',
        birthYear: '2000',
        weightKg: '70',
        heightCm: '175',
      },
      goal: EFitnessGoal.BuildMuscle,
      level: EExperienceLevel.Intermediate,
      daysPerWeek: 4,
    });
  });

  it('updates drafts and resets state', () => {
    const profile = {
      firstName: 'A',
      lastName: 'B',
      gender: EGender.Other,
      birthDay: '1',
      birthMonth: '1',
      birthYear: '2000',
      weightKg: '60',
      heightCm: '170',
    };

    useOnboardingDraftStore.getState().setProfileDraft(profile);
    useOnboardingDraftStore.getState().patchGoalsDraft({ goal: EFitnessGoal.GeneralFitness, daysPerWeek: 5 });

    expect(useOnboardingDraftStore.getState().profile).toEqual(profile);
    expect(useOnboardingDraftStore.getState().goal).toBe(EFitnessGoal.GeneralFitness);
    expect(useOnboardingDraftStore.getState().daysPerWeek).toBe(5);

    useOnboardingDraftStore.getState().reset();

    expect(useOnboardingDraftStore.getState()).toMatchObject({ hydrated: false, daysPerWeek: 3 });
  });
});
