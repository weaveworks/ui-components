import { kebabCase, forEach } from 'lodash';

export const fontFamilies = {
  regular: "'proxima-nova', Helvetica, Arial, sans-serif",
  monospace: "'Roboto Mono', monospace",
};

export const fontSizes = {
  huge: '48px',
  extraLarge: '32px',
  large: '22px',
  normal: '16px',
  small: '14px',
  tiny: '12px',
};

// Collects all theme font vars as SCSS vars.
export function themeFontsAsScss() {
  const themeFonts = [];

  forEach(fontFamilies, (value, name) => {
    themeFonts.push(`$font-family-${kebabCase(name)}: ${value}`);
  });

  forEach(fontSizes, (value, name) => {
    themeFonts.push(`$font-size-${kebabCase(name)}: ${value}`);
  });

  return themeFonts;
}
