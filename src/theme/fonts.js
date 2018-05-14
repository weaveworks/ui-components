import { kebabCase, forEach } from 'lodash';

export const fontSizes = {
  huge: '48px',
  extraLarge: '32px',
  large: '22px',
  normal: '16px',
  small: '14px',
  tiny: '12px',
};

export const fontFamily =
  "'proxima-nova', sans-serif, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Collects all theme font sizes as SCSS vars.
export function themeFontSizesAsScss() {
  const themeFontSizes = [];

  forEach(fontSizes, (value, name) => {
    themeFontSizes.push(`$font-size-${kebabCase(name)}: ${value}`);
  });

  return themeFontSizes;
}
