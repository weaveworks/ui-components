import { get, isObject } from 'lodash';

// `selector()` allows you to create closures over as
// many levels as you wish, each time returning another function.
// This lets you compose selectors and when they are passed an object
// finally select that value
export const selector = (propsOrSelector, prevArgs = []) => {
  if (isObject(propsOrSelector)) {
    return get(propsOrSelector, prevArgs);
  }

  return value => selector(value, [...prevArgs, propsOrSelector]);
};

const themeSelector = selector('theme');

// these are pre-composed selectors for our theme
// Usage:
//   const Success = styled.i`
//     color: ${color('green500')};
//   `;
export const boxShadow = themeSelector('boxShadow');
export const borderRadius = themeSelector('borderRadius');
export const color = themeSelector('colors');
export const fontSize = themeSelector('fontSizes');
export const spacing = themeSelector('spacing');
