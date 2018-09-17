// https://github.com/facebook/jest/issues/4545#issuecomment-332762365
global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};
global.cancelAnimationFrame = callback => {
  setTimeout(callback, 0);
};
