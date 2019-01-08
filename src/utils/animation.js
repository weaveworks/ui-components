import { spring } from 'react-motion';

export function weakSpring(value) {
  return spring(value, { damping: 18, precision: 1, stiffness: 100 });
}

export function strongSpring(value) {
  return spring(value, { damping: 50, precision: 1, stiffness: 800 });
}
