import intersection from 'lodash/intersection';
import first from 'lodash/first';
import keys from 'lodash/keys';

// Return the value of a set of props against a lookup object.
// Helps when using "ternary" props, ie: <Text small bold />
// Third argument is the default value to return in the event of an `undefined`;
export const lookupValue = (props, lookup, _default) => {
  const matches = intersection(keys(props), keys(lookup));

  if (matches.length > 1) {
    throw new Error(`You have specified conflicting props: ${JSON.stringify(matches)}`);
  }

  return lookup[first(matches)] || _default;
};
