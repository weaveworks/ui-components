import { darken } from 'polished';
import { isString, kebabCase, forEach } from 'lodash';

const colors = {
  // uncategorized colors
  alabaster: '#fcfcfc',
  aliceBlue: '#f0f8ff',
  alto: '#ddd',
  amethystSmoke: '#9292b7',
  athens: '#e2e2ec',
  athensGray: '#eeeef4',
  black: '#1a1a1a',
  blueHaze: '#c0c0d5',
  chetwodeBlue: '#8f8fd7',
  comet: '#5b5b88',
  cometDark: '#5a5a7b',
  darkGray: '#888',
  dimGray: '#666',
  doveGray: '#737373',
  dustyGray: '#969696',
  eastBay: '#4a5d87',
  gallery: '#eee',
  gray: '#aaaaaa',
  gunpowder: '#3c3c5b',
  kimberly: '#7d7da8',
  kimberlyDark: '#656597',
  lightgray: '#f8f8f8',
  logan: '#b1b1cb',
  mercury: '#e8e8e8',
  mischka: '#dfdfea',
  mulledWine: '#46466a',
  mystic: '#dae4ea',
  sand: '#f5f4f4',
  silver: '#ccc',
  silverDark: '#c1c1c1',
  solidGray: '#808080',
  stratos: '#001755',
  tundora: '#444',
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
    wellRead: '#ad3131',
    punch: '#dd4b39',
  },
};

const weave = {
  colors,

  textColor: colors.black,

  fontSizes: {
    normal: '0.875em',
    large: '2em',
    xl: '2.827em',
  },

  fontFamily:
    "'proxima-nova', sans-serif, 'Helvetica Neue', Helvetica, Arial, sans-serif",

  boxShadow: {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    heavy: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    selected: `0px 0px 2px 2px ${colors.primary.lavender}`,
  },

  borderRadius: '4px',

  layers: {
    front: 1,
    toolbar: 2,
    notification: 3,
    alert: 4,
    dropdown: 5,
    tooltip: 6,
    modal: 7,
  },

  // component-specific
  atoms: {
    Button: {
      default: {
        color: colors.black,
        background: colors.white,
        hoverColor: colors.gunpowder,
        hoverBackground: colors.lightgray,
      },
      primary: {
        color: colors.white,
        background: colors.turquoise,
        hoverColor: colors.white,
        hoverBackground: darken(0.05, colors.turquoise),
      },
      danger: {
        color: colors.white,
        background: colors.status.error,
        hoverColor: colors.white,
        hoverBackground: darken(0.05, colors.status.error),
      },
      disabled: {
        color: colors.gray,
        background: colors.lightgray,
        hoverColor: colors.gray,
        hoverBackground: colors.lightgray,
      },
    },
    Alert: {
      default: {
        color: colors.black,
        background: colors.lightgray,
        borderColor: colors.gray,
      },
      info: {
        color: colors.white,
        background: colors.status.info,
        borderColor: darken(0.15, colors.status.info),
      },
      success: {
        color: colors.white,
        background: colors.status.success,
        borderColor: darken(0.15, colors.status.success),
      },
      warning: {
        color: colors.white,
        background: colors.status.warning,
        borderColor: darken(0.15, colors.status.warning),
      },
      error: {
        color: colors.white,
        background: colors.status.error,
        borderColor: darken(0.15, colors.status.error),
      },
    },
  },
};

export default weave;

// Flattens and collects all theme colors as SCSS vars
function themeColorsAsScss() {
  const ignoreKeys = ['graphThemes'];
  const themeColors = [];

  forEach(weave.colors, (value, name) => {
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

// Collects all theme z-index layers as SCSS vars
function themeLayersAsScss() {
  const themeLayers = [];

  forEach(weave.layers, (value, name) => {
    themeLayers.push(`$layer-${kebabCase(name)}: ${value}`);
  });

  return themeLayers;
}

export function themeVarsAsScss() {
  const themeVariables = []
    .concat(themeColorsAsScss())
    .concat(themeLayersAsScss());
  return `${themeVariables.join('; ')};`;
}
