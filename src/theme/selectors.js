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

export const boxShadow = themeSelector('boxShadow');
export const borderRadius = themeSelector('borderRadius');
export const color = themeSelector('colors');
export const fontSize = themeSelector('fontSizes');
