import { darken } from 'polished';

const colors = {
  athens: '#e2e2ec',
  black: '#000',
  danger: '#ff0000',
  gray: '#aaaaaa',
  gunpowder: '#3c3c5b',
  lavender: '#8383ac',
  lightgray: '#d7d7d7',
  sand: '#f5f4f4',
  stratos: '#001755',
  turquoise: '#00bcd4',
  weaveblue: '#00D2FF',
  white: '#fff',
};

const weave = {
  colors,

  fontSizes: {
    small: '11.7px',
    medium: '14px',
  },

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
  },
};

export default weave;
