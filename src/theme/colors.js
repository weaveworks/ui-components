import { isString, kebabCase, forEach } from 'lodash';

export const colors = {
  // Neutral Colors
  black: 'hsl(0, 0%, 10%)', // #1a1a1a
  blue50: 'hsl(191, 100%, 97%)', // #f0fcff
  blue200: 'hsl(191, 100%, 80%)', // #99ecff
  blue400: 'hsl(191, 100%, 50%)', // #00d2ff
  blue600: 'hsl(191, 100%, 40%)', // #00a7cc
  blue700: 'hsl(191, 100%, 35%)', // #0092b3
  blue800: 'hsl(191, 100%, 30%)', // #007d99
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
    purple: [
      '#c1d4e7',
      '#9fbddb',
      '#8d95c6',
      '#8282ab',
      '#89429e',
      '#800f7a',
      '#0b0533',
    ],
  }, // Used by PrometheusGraph component
  gray50: 'hsl(0, 0%, 96%)', // #f4f4f4
  gray100: 'hsl(0, 0%, 90%)', // #e6e6e6
  gray200: 'hsl(0, 0%, 80%)', // #cccccc

  // #737373
  gray600: 'hsl(0, 0%, 45%)',
  green500: 'hsl(161, 54%, 48%)', // #38bd93
  orange500: 'hsl(13, 100%, 50%)', // #ff3700
  orange600: 'hsl(13, 100%, 40%)', // #cc2c00
  orange700: 'hsl(13, 100%, 35%)', // #b32700
  // Accent Colors
  // #992100
  orange800: 'hsl(13, 100%, 30%)',
  promQL: {
    attrName: '#00a4db',
    /**
     * GHColors theme by Avi Aryan (http://aviaryan.in)
     * Inspired by Github syntax coloring
     */
    comment: '#bbbbbb',
    deleted: '#9a050f',
    entity: '#36acaa',
    function: '#dc322f',
    metricName: '#2aa198',
    punctuation: '#393a34',
    // Dropdown colors,
    salmon: '#ff7c7c',
    string: '#e3116c',
    tag: '#00009f',
  }, // PromQL
  purple25: 'hsl(240, 20%, 98%)', // #fafafc
  purple50: 'hsl(240, 20%, 95%)', // #eeeef4
  purple100: 'hsl(240, 20%, 90%)', // #dfdfea
  purple200: 'hsl(240, 20%, 75%)', // #b1b1cb
  purple300: 'hsl(240, 20%, 65%)', // #9494b8
  purple400: 'hsl(240, 20%, 60%)', // #8585ad

  purple500: 'hsl(240, 20%, 50%)', // #666699
  purple600: 'hsl(240, 20%, 45%)', // #5b5b88
  purple700: 'hsl(240, 20%, 35%)', // #47476b
  purple800: 'hsl(240, 20%, 30%)', // #3d3d5c
  // Primary Colors
  // #32324b
  purple900: 'hsl(240, 20%, 25%)',

  // Third-party specific colors - not to be used in the theme!
  thirdParty: {
    azure: '#3769bb',
    // Google single-click login
    cornflowerBlue: '#4285f4',
  },
  // #ffffff
  white: 'hsl(0, 0%, 100%)',
  // #d4ab27
  yellow500: 'hsl(46, 69%, 49%)',
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
