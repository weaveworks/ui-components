import { kebabCase, forEach } from 'lodash';

export const layers = {
  alert: 3,
  dropdown: 5,
  front: 1,
  modal: 7,
  notification: 4,
  toolbar: 2,
  tooltip: 6,
};

// Collects all theme z-index layers as SCSS vars
export function themeLayersAsScss() {
  const themeLayers = [];

  forEach(layers, (value, name) => {
    themeLayers.push(`$layer-${kebabCase(name)}: ${value}`);
  });

  return themeLayers;
}
