import { signInSchema, signUpSchema } from '../schema';

describe('auth schemas', () => {
  describe('signInSchema', () => {
    it('accepts valid credentials', () => {
      expect(signInSchema.safeParse({ email: 'user@example.com', password: 'secret' }).success).toBe(true);
    });

    it('rejects invalid credentials', () => {
      expect(signInSchema.safeParse({ email: '', password: 'secret' }).success).toBe(false);
      expect(signInSchema.safeParse({ email: 'invalid', password: 'secret' }).success).toBe(false);
      expect(signInSchema.safeParse({ email: 'user@example.com', password: '' }).success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    const valid = {
      email: 'user@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    };

    it('accepts valid sign-up data', () => {
      expect(signUpSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects weak or mismatched passwords', () => {
      expect(signUpSchema.safeParse({ ...valid, password: 'Pass1', confirmPassword: 'Pass1' }).success).toBe(false);
      expect(signUpSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' }).success).toBe(false);
      expect(signUpSchema.safeParse({ ...valid, password: 'Password', confirmPassword: 'Password' }).success).toBe(false);
      expect(signUpSchema.safeParse({ ...valid, confirmPassword: 'Password2' }).success).toBe(false);
    });
  });
});
