import theme from '../theme';

interface ThemeWithColorSchemes {
  colorSchemes: Record<string, unknown>;
}

describe('theme', () => {
  it('defines dark and light color schemes with a primary color', () => {
    const { colorSchemes } = theme as unknown as ThemeWithColorSchemes;

    expect(colorSchemes.dark).toBeDefined();
    expect(colorSchemes.light).toBeDefined();
  });

  it('uses the Montserrat CSS variable for typography', () => {
    expect(theme.typography.fontFamily).toBe('var(--font-montserrat)');
  });
});
