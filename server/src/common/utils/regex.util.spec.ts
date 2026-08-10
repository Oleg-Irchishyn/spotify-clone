import { escapeRegExp } from './regex.util';

describe('escapeRegExp', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c');
  });

  it('leaves plain alphanumeric strings unchanged', () => {
    expect(escapeRegExp('Bohemian Rhapsody')).toBe('Bohemian Rhapsody');
  });

  it('escapes every special character used in a ReDoS-style pattern', () => {
    expect(escapeRegExp('(a+)+$')).toBe('\\(a\\+\\)\\+\\$');
  });

  it('produces a RegExp that matches the input literally, not as a pattern', () => {
    const regex = new RegExp(escapeRegExp('a.b'), 'i');

    expect(regex.test('axb')).toBe(false);
    expect(regex.test('a.b')).toBe(true);
  });

  it('returns an empty string when given an empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });
});
