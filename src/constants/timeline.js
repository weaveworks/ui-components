import moment from 'moment';


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
    intervalsMs: [
      moment.duration(1, 'year').asMilliseconds(),
    ],
  },
  month: {
    format: 'MMMM',
    parentPeriod: 'year',
    childPeriod: 'day',
    intervalsMs: [
      moment.duration(1, 'month').asMilliseconds(),
      moment.duration(3, 'months').asMilliseconds(),
    ],
  },
  day: {
    format: 'Do',
    parentPeriod: 'month',
    childPeriod: 'minute',
    intervalsMs: [
      moment.duration(1, 'day').asMilliseconds(),
      moment.duration(1, 'week').asMilliseconds(),
    ],
  },
  minute: {
    format: 'HH:mm',
    parentPeriod: 'day',
    intervalsMs: [
      moment.duration(1, 'minute').asMilliseconds(),
      moment.duration(5, 'minutes').asMilliseconds(),
      moment.duration(15, 'minutes').asMilliseconds(),
      moment.duration(1, 'hour').asMilliseconds(),
      moment.duration(3, 'hours').asMilliseconds(),
      moment.duration(6, 'hours').asMilliseconds(),
    ],
  },
};
