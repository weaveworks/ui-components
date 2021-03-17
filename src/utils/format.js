import moment from 'moment';

export const COMPACT_LOCALE_KEY = 'compact-time-ranges';

// FIXME: move this somewhere else?
(() => {
  // When you register a new locale moment.js changes the global to
  // the new entry. So save the current locale and then set it back.
  const defaultLocale = moment.locale();
  moment.locale(COMPACT_LOCALE_KEY, {
    relativeTime: {
      d: '1d',
      dd: '%dd',
      future: 'in %s',
      h: '1h',
      hh: '%dh',
      m: '1m',
      M: '1mo',
      mm: '%dm',
      MM: '%dmo',
      past: '%s ago',
      s: '%ds',
      y: '1y',
      yy: '%dy',
    },
  });
  moment.locale(defaultLocale);
})();
