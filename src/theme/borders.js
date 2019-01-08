import { kebabCase, forEach } from 'lodash';

export const borderRadius = {
  circle: '50%',
  none: '0',
  soft: '2px',
};

// Collects all theme border radii as SCSS vars.
export function themeBorderRadiiAsScss() {
  const themeBorderRadii = [];

  forEach(borderRadius, (value, name) => {
    themeBorderRadii.push(`$border-radius-${kebabCase(name)}: ${value}`);
  });

  return themeBorderRadii;
}
