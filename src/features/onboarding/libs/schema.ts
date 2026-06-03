import { EGender } from '@/constants/profile.constant';
import { z } from 'zod';

const numericInRange = (min: number, max: number, label: string) =>
  z
    .string()
    .min(1, 'Required')
    .refine(
      (v) => {
        const n = Number(v);
        return Number.isFinite(n) && n >= min && n <= max;
      },
      { message: `Enter ${label}` },
    );

export const profileSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    gender: z.enum([EGender.Male, EGender.Female, EGender.Other], {
      message: 'Select your gender',
    }),
    birthDay: z.string().min(1, 'Required'),
    birthMonth: z.string().min(1, 'Required'),
    birthYear: z.string().min(1, 'Required'),
    weightKg: numericInRange(20, 400, '20–400 kg'),
    heightCm: numericInRange(80, 260, '80–260 cm'),
  })
  .superRefine((data, ctx) => {
    const d = Number(data.birthDay);
    const m = Number(data.birthMonth);
    const y = Number(data.birthYear);
    if (![d, m, y].every(Number.isInteger)) {
      ctx.addIssue({ code: 'custom', message: 'Invalid date', path: ['birthYear'] });
      return;
    }
    const date = new Date(y, m - 1, d);
    const valid =
      date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    if (!valid) {
      ctx.addIssue({ code: 'custom', message: 'Invalid date', path: ['birthYear'] });
      return;
    }
    const now = new Date();
    let age = now.getFullYear() - y;
    const beforeBirthday =
      now.getMonth() < m - 1 || (now.getMonth() === m - 1 && now.getDate() < d);
    if (beforeBirthday) age -= 1;
    if (age < 10 || age > 100) {
      ctx.addIssue({ code: 'custom', message: 'Age must be 10–100', path: ['birthYear'] });
    }
  });

export type ProfileForm = z.infer<typeof profileSchema>;

export function toIsoDate(day: string, month: string, year: string): string {
  const dd = String(Number(day)).padStart(2, '0');
  const mm = String(Number(month)).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function fromIsoDate(iso?: string): { day: string; month: string; year: string } {
  if (!iso) return { day: '', month: '', year: '' };
  const [year = '', month = '', day = ''] = iso.split('-');
  return { day: String(Number(day) || ''), month: String(Number(month) || ''), year };
}
