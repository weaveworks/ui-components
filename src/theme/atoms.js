import { colors } from './colors';

// component-specific
export const atoms = {
  Alert: {
    error: {
      background: colors.orange600,
      color: colors.white,
    },
    info: {
      background: colors.blue600,
      color: colors.white,
    },
    success: {
      background: colors.green500,
      color: colors.white,
    },
    warning: {
      background: colors.yellow500,
      color: colors.white,
    },
  },
  Button: {
    danger: {
      background: colors.orange600,
      color: colors.white,
      hoverBackground: colors.orange700,
      hoverColor: colors.white,
    },
    default: {
      background: colors.white,
      color: colors.black,
      hoverBackground: colors.gray50,
      hoverColor: colors.purple800,
    },
    disabled: {
      background: colors.gray50,
      color: colors.gray600,
      hoverBackground: colors.gray50,
      hoverColor: colors.gray600,
    },
    primary: {
      background: colors.blue700,
      color: colors.white,
      hoverBackground: colors.blue800,
      hoverColor: colors.white,
    },
  },
};
