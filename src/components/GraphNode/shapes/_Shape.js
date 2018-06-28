import React from 'react';
import { line, curveCardinalClosed } from 'd3-shape';
import { range } from 'lodash';

import BaseShape from './_BaseShape';
import StackedShape from './_StackedShape';

export function curvedUnitPolygonPath(n) {
  const curve = curveCardinalClosed.tension(0.65);
  const spline = line().curve(curve);
  const innerAngle = (2 * Math.PI) / n;
  return spline(range(0, n).map(k => [
    Math.sin(k * innerAngle),
    -Math.cos(k * innerAngle),
  ]));
}

const Shape = props => props.stacked ?
  <StackedShape {...props} /> :
  <BaseShape {...props} />;

export default Shape;
