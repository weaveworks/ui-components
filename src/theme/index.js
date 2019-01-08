import { colors, themeColorsAsScss } from './colors';
import { fontSizes, fontFamilies, themeFontsAsScss } from './fonts';
import { borderRadius, themeBorderRadiiAsScss } from './borders';
import { layers, themeLayersAsScss } from './layers';
import { spacing, themeSpacingsAsScss } from './spacings';
import { overlayIconSize, textColor, themeMiscVarsAsScss } from './misc';
import { boxShadow } from './box-shadows';
import { atoms } from './atoms';

export function themeVarsAsScss() {
  const themeVariables = []
    .concat(themeColorsAsScss())
    .concat(themeLayersAsScss())
    .concat(themeFontsAsScss())
    .concat(themeBorderRadiiAsScss())
    .concat(themeSpacingsAsScss())
    .concat(themeMiscVarsAsScss());
  return `${themeVariables.join('; ')};`;
}

const theme = {
  // Component-specific
  atoms,

  // Borders
  borderRadius,

  // Box shadows
  boxShadow,

  // Colors
  colors,

  // Fonts
  fontFamilies,
  fontSizes,

  // z-index layers
  layers,

  // Misc
  overlayIconSize,

  // Spacings
  spacing,
  textColor,
};

export default theme;
