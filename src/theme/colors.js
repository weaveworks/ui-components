import { isString, kebabCase, forEach } from 'lodash';

export const colors = {
  // uncategorized colors
  aliceBlue: '#f0f8ff',
  amethystSmoke: '#9292b7',
  athens: '#e2e2ec',
  athensGray: '#eeeef4',
  black: '#1a1a1a',
  blueHaze: '#c0c0d5',
  comet: '#5b5b88',
  cometDark: '#5a5a7b',
  doveGray: '#737373',
  eastBay: '#4a5d87',
  gallery: '#f4f4f4',
  gunpowder: '#3c3c5b',
  kimberly: '#7d7da8',
  kimberlyDark: '#656597',
  logan: '#b1b1cb',
  mischka: '#dfdfea',
  mulledWine: '#46466a',
  mystic: '#dae4ea',
  silver: '#ccc',
  turquoise: '#037aa9',
  white: '#fff',
  whiteLilac: '#f0f0fa',
  whiteSmoke: '#fafafc',
  promQL: {
    /**
     * GHColors theme by Avi Aryan (http://aviaryan.in)
     * Inspired by Github syntax coloring
     */
    comment: '#bbbbbb',
    string: '#e3116c',
    punctuation: '#393a34',
    entity: '#36acaa',
    metricName: '#2aa198',
    attrName: '#00a4db',
    function: '#dc322f',
    deleted: '#9a050f',
    tag: '#00009f',
    // Dropdown colors,
    salmon: '#ff7c7c',
  },
  // use these for new stuff!
  primary: {
    charcoal: '#32324b',
    lavender: '#8383ac',
  },
  accent: {
    blue: '#00d2ff',
    orange: '#ff4b19',
  },
  status: {
    // Use these when colorizing elements that should indicate a state or outcome, ie Alerts.
    success: '#38bd93', // green
    error: '#c7254e', // red
    warning: '#d4ab27', // amber
    info: '#049cd7', // blue
    disabled: '#9a9a9a',
  },
  // Used by PrometheusGraph component
  graphThemes: {
    blue: [
      '#c7e9b4',
      '#7ecdbb',
      '#1eb5eb',
      '#1d91bf',
      '#235fa9',
      '#253393',
      '#084181',
    ],
    purple: [
      '#c1d4e7',
      '#9fbddb',
      '#8d95c6',
      '#8282ab',
      '#89429e',
      '#800f7a',
      '#0b0533',
    ],
    mixed: [
      '#c7e9b4',
      '#c1d4e7',
      '#7ecdbb',
      '#9fbddb',
      '#1eb5eb',
      '#8d95c6',
      '#1d91bf',
      '#8282ab',
      '#235fa9',
      '#89429e',
      '#253393',
      '#800f7a',
      '#084181',
      '#0b0533',
    ],
  },
  // Third-party specific colors - not to be used in the theme!
  thirdParty: {
    // Google single-click login
    cornflowerBlue: '#4285f4',
    azure: '#3769bb',
  },
};

// Flattens and collects all theme colors as SCSS vars
export function themeColorsAsScss() {
  const ignoreKeys = ['graphThemes'];
  const themeColors = [];

  forEach(colors, (value, name) => {
    const colorPrefix = `$color-${kebabCase(name)}`;
    if (ignoreKeys.includes(name)) return;

    if (isString(value)) {
      themeColors.push(`${colorPrefix}: ${value}`);
    } else {
      forEach(value, (innerValue, subname) => {
        if (ignoreKeys.includes(subname)) return;
        themeColors.push(`${colorPrefix}-${kebabCase(subname)}: ${innerValue}`);
      });
    }
  });

  return themeColors;
}
