
export const TIMELINE_HEIGHT = '55px';
export const MIN_TICK_SPACING_PX = 70;
export const MAX_TICK_SPACING_PX = 415;
export const FADE_OUT_FACTOR = 1.4;
export const TICKS_ROW_SPACING = 16;
export const MAX_TICK_ROWS = 3;
export const MIN_RANGE_INTERVAL_PX = 6;

export const TICK_SETTINGS_PER_PERIOD = {
  year: {
    format: 'YYYY',
    childPeriod: 'month',
    periodIntervals: [1], // 1 year
  },
  month: {
    format: 'MMMM',
    parentPeriod: 'year',
    childPeriod: 'day',
    periodIntervals: [1, 3], // 1 month, 1 quarter
  },
  day: {
    format: 'Do',
    parentPeriod: 'month',
    childPeriod: 'minute',
    periodIntervals: [1, 7], // 1 day, 1 week
  },
  minute: {
    format: 'HH:mm',
    parentPeriod: 'day',
    periodIntervals: [1, 5, 15, 60, 180, 360], // 1min, 5min, 15min, 1h, 3h, 6h
  },
};
