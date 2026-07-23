import { EGender } from '@/constants/profile.constant';
import { fromIsoDate, profileSchema, toIsoDate } from '../schema';

describe('onboarding schema helpers', () => {
  const validProfile = {
    firstName: 'Tai',
    lastName: 'Lam',
    gender: EGender.Male,
    birthDay: '1',
    birthMonth: '1',
    birthYear: '2000',
    weightKg: '70',
    heightCm: '175',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-23T12:00:00.000Z'));
  });

  it('accepts a valid profile', () => {
    expect(profileSchema.safeParse(validProfile).success).toBe(true);
  });

  it('rejects missing names and out-of-range body metrics', () => {
    expect(profileSchema.safeParse({ ...validProfile, firstName: '' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, lastName: '' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, weightKg: '19' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, weightKg: '401' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, heightCm: '79' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, heightCm: '261' }).success).toBe(false);
  });

  it('rejects invalid dates and ages outside 10-100', () => {
    expect(profileSchema.safeParse({ ...validProfile, birthDay: '31', birthMonth: '2' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, birthYear: '2020' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...validProfile, birthYear: '1920' }).success).toBe(false);
  });

  it('converts date parts to and from ISO date strings', () => {
    expect(toIsoDate('3', '7', '2000')).toBe('2000-07-03');
    expect(fromIsoDate('2000-07-03')).toEqual({ day: '3', month: '7', year: '2000' });
    expect(fromIsoDate()).toEqual({ day: '', month: '', year: '' });
  });
});
