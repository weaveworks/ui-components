import { kebabCase, forEach } from 'lodash';

export const layers = {
  front: 1,
  toolbar: 2,
  alert: 3,
  notification: 4,
  dropdown: 5,
  tooltip: 6,
  modal: 7,
};

// Collects all theme z-index layers as SCSS vars
export function themeLayersAsScss() {
  const themeLayers = [];

  forEach(layers, (value, name) => {
    themeLayers.push(`$layer-${kebabCase(name)}: ${value}`);
  });

  return themeLayers;
}
