import { forEach } from 'lodash';

const baseSpacingNumber = 16;

export const spacing = {
  // 16px
  base: `${baseSpacingNumber}px`,
  // 32px
  large: `${baseSpacingNumber * 2}px`,
  // 24px
  medium: `${baseSpacingNumber * 1.5}px`,
  none: '0',
  // 12px
  small: `${baseSpacingNumber * 0.75}px`,
  // 48px
  xl: `${baseSpacingNumber * 3}px`,
  // 8px
  xs: `${baseSpacingNumber * 0.5}px`,
  // 64px
  xxl: `${baseSpacingNumber * 4}px`,
  // 4px
  xxs: `${baseSpacingNumber * 0.25}px`,
};

// Collects all theme spacing vars as SCSS vars.
export function themeSpacingsAsScss() {
  const themeSpacings = [];

  forEach(spacing, (value, name) => {
    themeSpacings.push(`$spacing-${name}: ${value}`);
  });

  return themeSpacings;
}
