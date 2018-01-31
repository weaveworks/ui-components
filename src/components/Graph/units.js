import moment from 'moment';

const MIN_TICKS = 3;
const MAX_TICKS = 6;

function spreadTicksBetween([min, max], { baseStep = 1, formatFor, scale }) {
  // Tweak the step to show a reasonable number of ticks.
  let step = baseStep;
  while ((max - min) / step > MAX_TICKS) step *= 2;
  while ((max - min) / step < MIN_TICKS) step /= 2;

  let p = Math.ceil(min / step) * step;
  const format = formatFor(p + step); // this is usually the lowest non-zero value
  const result = [];

  for (; p <= max; p += step) {
    result.push({
      value: format(p),
      offset: scale(p),
    });
  }
  return result;
}

export const numericUnits = {
  formatFor(number) {
    let baseUnit = 1;
    let precision = 4;
    let unitLabel = '';

    const bigNumber = [
      { label: 'T', unit: 1000000000000 },
      { label: 'G', unit: 1000000000 },
      { label: 'M', unit: 1000000 },
      { label: 'k', unit: 1000 },
    ].find(({ unit }) => number / unit >= 2);
    const smallNumber = [
      { base: 1, prec: 0 },
      { base: 0.1, prec: 1 },
      { base: 0.01, prec: 2 },
      { base: 0.001, prec: 3 },
      { base: 0.0001, prec: 4 },
    ].find(({ base }) => number / base >= 2);

    if (bigNumber) {
      baseUnit = bigNumber.unit;
      unitLabel = bigNumber.label;
      precision = 0;
    } else if (smallNumber) {
      precision = smallNumber.prec;
    }

    return (n) => {
      if (n === null) return '---';
      if (n === 0) return '0';
      return `${(n / baseUnit).toFixed(precision)} ${unitLabel}`;
    };
  },
  getSpread([min, max], scale) {
    return spreadTicksBetween([min, max], { formatFor: this.formatFor, scale });
  },
};

export const memoryUnits = {
  formatFor(bytes) {
    const data = [
      { label: 'TB', unit: 1024 * 1024 * 1024 * 1024 },
      { label: 'GB', unit: 1024 * 1024 * 1024 },
      { label: 'MB', unit: 1024 * 1024 },
      { label: 'kB', unit: 1024 },
      { label: 'B', unit: 1 },
    ].find(({ unit }) => bytes / unit >= 2);

    return (n) => {
      if (n === null) return '---';
      if (!data) return '0';
      return `${Math.round(n / data.unit)} ${data.label}`;
    };
  },
  getSpread([min, max], scale) {
    return spreadTicksBetween([min, max], { formatFor: this.formatFor, scale });
  },
};

export const percentageUnits = {
  formatFor() {
    return (n) => {
      if (n === null) return '---';
      if (n === 0) return '0%';
      return `${Number(n * 100).toFixed(2)}%`;
    };
  },
  getSpread([min, max], scale) {
    return spreadTicksBetween([min, max], { formatFor: this.formatFor, scale });
  },
};

export const timeUnits = {
  format(seconds) {
    if (seconds === null) return '---';

    const timestamp = moment(seconds * 1000).utc();

    // Show month and day instead of hour and minute at midnight.
    const startOfDay = timestamp.clone().startOf('day');
    if (timestamp.diff(startOfDay) === 0) {
      return timestamp.format('MMM DD');
    }

    return timestamp.format('HH:mm');
  },
  getSpread([min, max], scale) {
    return spreadTicksBetween([min, max], {
      baseStep: 15 * 60,
      formatFor: () => this.format,
      scale,
    });
  },
};
