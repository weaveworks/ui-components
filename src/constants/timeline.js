import moment from 'moment';


export const TIMELINE_HEIGHT = '55px';
export const MIN_TICK_SPACING_PX = 70;
export const MAX_TICK_SPACING_PX = 415;
export const FADE_OUT_FACTOR = 1.4;
export const TICKS_ROW_SPACING = 16;
export const MAX_TICK_ROWS = 3;

export const TICK_SETTINGS_PER_PERIOD = {
  year: {
    format: 'YYYY',
    childPeriod: 'month',
    intervals: [
      moment.duration(1, 'year'),
    ],
  },
  month: {
    format: 'MMMM',
    parentPeriod: 'year',
    childPeriod: 'day',
    intervals: [
      moment.duration(1, 'month'),
      moment.duration(3, 'months'),
    ],
  },
  day: {
    format: 'Do',
    parentPeriod: 'month',
    childPeriod: 'minute',
    intervals: [
      moment.duration(1, 'day'),
      moment.duration(1, 'week'),
    ],
  },
  minute: {
    format: 'HH:mm',
    parentPeriod: 'day',
    intervals: [
      moment.duration(1, 'minute'),
      moment.duration(5, 'minutes'),
      moment.duration(15, 'minutes'),
      moment.duration(1, 'hour'),
      moment.duration(3, 'hours'),
      moment.duration(6, 'hours'),
    ],
  },
};
