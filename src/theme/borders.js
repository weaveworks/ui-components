import { kebabCase, forEach } from 'lodash';

export const borderRadius = {
  none: '0',
  soft: '2px',
  circle: '50%',
};

// Collects all theme border radii as SCSS vars.
export function themeBorderRadiiAsScss() {
  const themeBorderRadii = [];

  forEach(borderRadius, (value, name) => {
    themeBorderRadii.push(`$border-radius-${kebabCase(name)}: ${value}`);
  });

  return themeBorderRadii;
}
