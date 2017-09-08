import React from 'react';
import intersection from 'lodash/intersection';
import first from 'lodash/first';
import keys from 'lodash/keys';
import _get from 'lodash/get';
import { ThemeProvider } from 'styled-components';

import theme from '../theme';

// Return the value of a set of props against a lookup object.
// Helps when using "ternary" props, ie: <Text small bold />
// Third argument is the default value to return in the event of an `undefined`;
export const lookupValue = (props, lookup, _default) => {
  const matches = intersection(keys(props), keys(lookup));

  if (matches.length > 1) {
    throw new Error(`You have specified conflicting props: ${JSON.stringify(matches)}`);
  }

  return lookup[first(matches)] || _default;
};

export const withTheme = component => <ThemeProvider theme={theme}>{component}</ThemeProvider>;

// Shorthand for gettings values from the theme.
// `variationKey` is a string matching the prop to use to lookup `field`.
// See <Button /> or <Alert /> for an example.
export const fromAtoms = (component, variationKey, field) => props =>
  _get(props.theme.atoms, [component, _get(props, variationKey), field]);
