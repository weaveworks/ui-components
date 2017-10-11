import { darken } from 'polished';

const neutral = {
  black: '#1a1a1a',
  gray: '#aaaaaa',
  lightgray: '#f8f8f8',
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
  weaveblue: '#00D2FF',
  white: '#fff',
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
