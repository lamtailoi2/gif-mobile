import { getLocalDateString } from '../date';

describe('getLocalDateString', () => {
  it('formats Date values as YYYY-MM-DD', () => {
    expect(getLocalDateString(new Date(2026, 6, 3, 23, 59))).toBe('2026-07-03');
  });

  it('formats string and number inputs', () => {
    const date = new Date(2026, 0, 9, 12, 0);

    expect(getLocalDateString(date.toString())).toBe('2026-01-09');
    expect(getLocalDateString(date.getTime())).toBe('2026-01-09');
  });

  it('returns an empty string for invalid dates', () => {
    expect(getLocalDateString('not-a-date')).toBe('');
  });
});
