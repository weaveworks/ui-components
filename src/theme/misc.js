import { colors } from './colors';

export const overlayIconSize = '300px';
export const textColor = colors.black;

// Collects all theme misc vars as SCSS vars.
export function themeMiscVarsAsScss() {
  return [`$overlay-icon-size: ${overlayIconSize}`];
}
