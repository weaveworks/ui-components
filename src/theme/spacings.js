import { forEach } from 'lodash';

const baseSpacingNumber = 16;

export const spacing = {
  none: '0',
  // 4px
  xxs: `${baseSpacingNumber * 0.25}px`,
  // 8px
  xs: `${baseSpacingNumber * 0.5}px`,
  // 12px
  small: `${baseSpacingNumber * 0.75}px`,
  // 16px
  base: `${baseSpacingNumber}px`,
  // 24px
  medium: `${baseSpacingNumber * 1.5}px`,
  // 32px
  large: `${baseSpacingNumber * 2}px`,
  // 48px
  xl: `${baseSpacingNumber * 3}px`,
  // 64px
  xxl: `${baseSpacingNumber * 4}px`,
};

// Collects all theme spacing vars as SCSS vars.
export function themeSpacingsAsScss() {
  const themeSpacings = [];

  forEach(spacing, (value, name) => {
    themeSpacings.push(`$spacing-${name}: ${value}`);
  });

  return themeSpacings;
}
