import { forEach } from 'lodash';

export const spacing = {
  none: '0',
  xxs: '4px',
  xs: '8px',
  small: '12px',
  base: '16px',
  medium: '24px',
  large: '32px',
  xl: '48px',
  xxl: '64px',
};

// Collects all theme spacing vars as SCSS vars.
export function themeSpacingsAsScss() {
  const themeSpacings = [];

  forEach(spacing, (value, name) => {
    themeSpacings.push(`$spacing-${name}: ${value}`);
  });

  return themeSpacings;
}
