import { isString, kebabCase, forEach } from 'lodash';

export const colors = {
  // Primary Colors
  purple900: 'hsl(240, 20%, 25%)', // #32324b
  purple800: 'hsl(240, 20%, 30%)', // #3d3d5c
  purple700: 'hsl(240, 20%, 35%)', // #47476b
  purple600: 'hsl(240, 20%, 45%)', // #5b5b88
  purple500: 'hsl(240, 20%, 50%)', // #666699
  purple400: 'hsl(240, 20%, 60%)', // #8585ad
  purple300: 'hsl(240, 20%, 65%)', // #9494b8
  purple200: 'hsl(240, 20%, 75%)', // #b1b1cb
  purple100: 'hsl(240, 20%, 90%)', // #dfdfea
  purple50: 'hsl(240, 20%, 95%)', // #eeeef4
  purple25: 'hsl(240, 20%, 98%)', // #fafafc

  // Accent Colors
  orange800: 'hsl(13, 100%, 30%)', // #992100
  orange700: 'hsl(13, 100%, 35%)', // #b32700
  orange600: 'hsl(13, 100%, 40%)', // #cc2c00
  orange500: 'hsl(13, 100%, 50%)', // #ff3700
  blue800: 'hsl(191, 100%, 30%)', // #007d99
  blue700: 'hsl(191, 100%, 35%)', // #0092b3
  blue600: 'hsl(191, 100%, 40%)', // #00a7cc
  blue400: 'hsl(191, 100%, 50%)', // #00d2ff
  blue200: 'hsl(191, 100%, 80%)', // #99ecff
  blue50: 'hsl(191, 100%, 97%)', // #f0fcff

  // Neutral Colors
  black: 'hsl(0, 0%, 10%)', // #1a1a1a
  gray600: 'hsl(0, 0%, 45%)', // #737373
  gray200: 'hsl(0, 0%, 80%)', // #cccccc
  gray100: 'hsl(0, 0%, 90%)', // #e6e6e6
  gray50: 'hsl(0, 0%, 96%)', // #f4f4f4
  white: 'hsl(0, 0%, 100%)', // #ffffff

  /* Legacy */
  status: {
    success: '#38bd93', // green
    warning: '#d4ab27', // amber
  },

  // PromQL
  promQL: {
    /**
     * GHColors theme by Avi Aryan (http://aviaryan.in)
     * Inspired by Github syntax coloring
     */
    comment: '#bbbbbb',
    string: '#e3116c',
    punctuation: '#393a34',
    entity: '#36acaa',
    metricName: '#2aa198',
    attrName: '#00a4db',
    function: '#dc322f',
    deleted: '#9a050f',
    tag: '#00009f',
    // Dropdown colors,
    salmon: '#ff7c7c',
  },
  // Used by PrometheusGraph component
  graphThemes: {
    blue: [
      '#c7e9b4',
      '#7ecdbb',
      '#1eb5eb',
      '#1d91bf',
      '#235fa9',
      '#253393',
      '#084181',
    ],
    purple: [
      '#c1d4e7',
      '#9fbddb',
      '#8d95c6',
      '#8282ab',
      '#89429e',
      '#800f7a',
      '#0b0533',
    ],
    mixed: [
      '#c7e9b4',
      '#c1d4e7',
      '#7ecdbb',
      '#9fbddb',
      '#1eb5eb',
      '#8d95c6',
      '#1d91bf',
      '#8282ab',
      '#235fa9',
      '#89429e',
      '#253393',
      '#800f7a',
      '#084181',
      '#0b0533',
    ],
  },
  // Third-party specific colors - not to be used in the theme!
  thirdParty: {
    // Google single-click login
    cornflowerBlue: '#4285f4',
    azure: '#3769bb',
  },
};

// Flattens and collects all theme colors as SCSS vars
export function themeColorsAsScss() {
  const ignoreKeys = ['graphThemes'];
  const themeColors = [];

  forEach(colors, (value, name) => {
    const colorPrefix = `$color-${kebabCase(name)}`;
    if (ignoreKeys.includes(name)) return;

    if (isString(value)) {
      themeColors.push(`${colorPrefix}: ${value}`);
    } else {
      forEach(value, (innerValue, subname) => {
        if (ignoreKeys.includes(subname)) return;
        themeColors.push(`${colorPrefix}-${kebabCase(subname)}: ${innerValue}`);
      });
    }
  });

  return themeColors;
}
