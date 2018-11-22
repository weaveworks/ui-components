import { forEach } from 'lodash';

export const spacing = {
  none: '0px',
  xss: '4px',
  xs: '8px',
  small: '16px',
  base: '24px',
  large: '48px',
  xl: '64px',
};

// Collects all theme spacing vars as SCSS vars.
export function themeSpacingsAsScss() {
  const themeSpacings = [];

  forEach(spacing, (value, name) => {
    themeSpacings.push(`$spacing-${name}: ${value}`);
  });

  return themeSpacings;
}
