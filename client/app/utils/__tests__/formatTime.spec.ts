import { formatTime } from '../formatTime';

describe('formatTime', () => {
  it('formats whole seconds as m:ss', () => {
    expect(formatTime(65)).toBe('1:05');
  });

  it('formats zero as 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('pads single-digit seconds with a leading zero', () => {
    expect(formatTime(9)).toBe('0:09');
  });

  it('floors fractional seconds', () => {
    expect(formatTime(90.9)).toBe('1:30');
  });

  it('handles minutes over 9', () => {
    expect(formatTime(725)).toBe('12:05');
  });

  it('returns 0:00 for negative values', () => {
    expect(formatTime(-5)).toBe('0:00');
  });

  it('returns 0:00 for NaN', () => {
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('returns 0:00 for Infinity', () => {
    expect(formatTime(Infinity)).toBe('0:00');
  });
});
