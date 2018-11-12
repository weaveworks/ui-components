import { selector, color, fontSize } from './selectors';

import theme from '.';

const props = { theme };

describe('ThemeSelectors', () => {
  describe('fontSizes', () => {
    it('should retrieve a fontSize', () => {
      expect(typeof fontSize).toBe('function');
      expect(fontSize('small')(props)).toBe(10);
    });
  });

  describe('colors', () => {
    it('should retrieve a color', () => {
      expect(typeof color).toBe('function');
      expect(color('grey200')(props)).toBe('#333');
    });
  });

  describe('custom selector', () => {
    it('should return a function ', () => {
      const wongoBongo = selector('wongo.bongo');
      expect(typeof wongoBongo).toBe('function');
      expect(wongoBongo('jibberish')).toBe('boo');
    });
  });
});
