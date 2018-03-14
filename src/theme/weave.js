import { darken } from 'polished';

const neutral = {
  black: '#1a1a1a',
  gray: '#9a9a9a',
  lightgray: '#c1c1c1',
  white: '#fff',
};

const colors = {
  // legacy
  athens: '#e2e2ec',
  black: '#000',
  danger: '#ff0000',
  gray: '#aaaaaa',
  gunpowder: '#3c3c5b',
  lavender: '#8383ac',
  lightgray: '#f8f8f8',
  sand: '#f5f4f4',
  stratos: '#001755',
  turquoise: '#00bcd4',
  weaveblue: '#00d2ff',
  white: '#fff',
  // more legacy
  alabaster: '#fcfcfc',
  alto: '#ddd',
  amethystSmoke: '#9292b7',
  armadillo: '#393a34',
  athensGray: '#eeeef4',
  blueHaze: '#c0c0d5',
  cerulean: '#00a8cc',
  chamois: '#eee1ba',
  chetwodeBlue: '#8f8fd7',
  comet: '#5b5b88',
  cometDark: '#5a5a7b',
  darkGray: '#888',
  dimGray: '#666',
  doveGray: '#737373',
  eastBay: '#4a5d87',
  fern: '#66bb6a',
  gallery: '#eee',
  hokeyPokey: '#d69e30',
  jaggedIce: '#bfe7db',
  kimberly: '#7d7da8',
  kimberlyDark: '#656597',
  lemonChiffon: '#ffffc8',
  logan: '#b1b1cb',
  mercury: '#e8e8e8',
  mischka: '#dfdfea',
  mischkaDark: '#d2d2d8',
  mulledWine: '#46466a',
  punch: '#dd4b39',
  sail: '#b3d4fc',
  salmon: '#ff7c7c',
  scooter: '#2db5ca',
  silver: '#ccc',
  snuff: '#dadaea',
  thunderbird: '#b71c1c',
  titanWhite: '#eeeeff',
  tundora: '#444',
  veniceBlue: '#065f7d',
  wellRead: '#ad3131',
  whisper: '#fdfdfe',
  whiteLilac: '#f0f0fa',
  whiteSmoke: '#fafafc',
  wildSand: '#f5f4f4',
  winterHazel: '#d2d296',
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
    disabled: neutral.gray,
  },
  neutral,
};

const weave = {
  colors,

  textColor: colors.neutral.black,

  fontSizes: {
    normal: '0.875em',
    large: '2em',
    xl: '2.827em',
  },

  fontFamily: '\'proxima-nova\', sans-serif, \'Helvetica Neue\', Helvetica, Arial, sans-serif',

  boxShadow: {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    heavy: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    selected: `0px 0px 2px 2px ${colors.lavender}`,
  },

  borderRadius: '4px',

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
        hoverBackground: darken(0.15, colors.turquoise),
      },
      danger: {
        color: colors.white,
        background: colors.danger,
        hoverColor: colors.white,
        hoverBackground: darken(0.15, colors.danger),
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
      }
    }
  },
};

export default weave;
