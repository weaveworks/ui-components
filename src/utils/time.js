import moment from 'moment';


export function nowInSecondsPrecision() {
  return moment().startOf('second');
}

// This is unfortunately not there in moment.js
export function scaleDuration(duration, scale) {
  return moment.duration(duration.asMilliseconds() * scale);
}
