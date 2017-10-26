import moment from 'moment';


export function nowInSecondsPrecision() {
  return moment().startOf('second');
}

// This is unfortunately not there in moment.js
export function scaleDuration(duration, scale) {
  return moment.duration(duration.asMilliseconds() * scale);
}

export function clampDuration(duration, [minDuration, maxDuration]) {
  let durationMs = duration.asMilliseconds();
  if (minDuration && minDuration.asMilliseconds() > durationMs) {
    durationMs = minDuration.asMilliseconds();
  }
  if (maxDuration && maxDuration.asMilliseconds() < durationMs) {
    durationMs = maxDuration.asMilliseconds();
  }
  return moment.duration(durationMs);
}
