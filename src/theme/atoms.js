import { darken } from 'polished';

import { colors } from './colors';

// component-specific
export const atoms = {
  Alert: {
    default: {
      color: colors.black,
      background: colors.gray50,
      borderColor: colors.gray200,
    },
    info: {
      color: colors.white,
      background: colors.blue600,
      borderColor: colors.blue800,
    },
    success: {
      color: colors.white,
      background: colors.green500,
      borderColor: darken(0.15, colors.green500),
    },
    warning: {
      color: colors.white,
      background: colors.yellow500,
      borderColor: darken(0.15, colors.yellow500),
    },
    error: {
      color: colors.white,
      background: colors.orange600,
      borderColor: colors.orange800,
    },
  },
  Button: {
    default: {
      color: colors.black,
      background: colors.white,
      hoverColor: colors.purple800,
      hoverBackground: colors.gray50,
    },
    primary: {
      color: colors.white,
      background: colors.blue700,
      hoverColor: colors.white,
      hoverBackground: colors.blue800,
    },
    danger: {
      color: colors.white,
      background: colors.orange600,
      hoverColor: colors.white,
      hoverBackground: colors.orange700,
    },
    disabled: {
      color: colors.gray600,
      background: colors.gray50,
      hoverColor: colors.gray600,
      hoverBackground: colors.gray50,
    },
  },
};
