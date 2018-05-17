import { colors, themeColorsAsScss } from './colors';
import { fontSizes, fontFamilies, themeFontsAsScss } from './fonts';
import { borderRadius, themeBorderRadiiAsScss } from './borders';
import { layers, themeLayersAsScss } from './layers';
import { overlayIconSize, textColor, themeMiscVarsAsScss } from './misc';
import { boxShadow } from './box-shadows';
import { atoms } from './atoms';

export function themeVarsAsScss() {
  const themeVariables = []
    .concat(themeColorsAsScss())
    .concat(themeLayersAsScss())
    .concat(themeFontsAsScss())
    .concat(themeBorderRadiiAsScss())
    .concat(themeMiscVarsAsScss());
  return `${themeVariables.join('; ')};`;
}

const theme = {
  // Component-specific
  atoms,

  // Box shadows
  boxShadow,

  // Borders
  borderRadius,

  // Colors
  colors,

  // Fonts
  fontFamilies,
  fontSizes,

  // z-index layers
  layers,

  // Misc
  overlayIconSize,
  textColor,
};

export default theme;
