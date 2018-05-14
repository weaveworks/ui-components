import { darken } from 'polished';

import { colors } from './colors';

// component-specific
export const atoms = {
  Alert: {
    default: {
      color: colors.black,
      background: colors.lightgray,
      borderColor: darken(0.15, colors.lightgray),
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
  Button: {
    default: {
      color: colors.black,
      background: colors.white,
      hoverColor: colors.gunpowder,
      hoverBackground: darken(0.05, colors.white),
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
};
