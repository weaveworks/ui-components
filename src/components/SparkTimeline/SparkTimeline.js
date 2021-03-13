import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { range } from 'lodash';
import { scaleLinear } from 'd3-scale';
import { useMeasure } from 'react-use';

import { color } from '../../theme/selectors';

const Container = styled.div`
  width: 100%;
  height: 100%;

  svg {
    overflow: visible;
  }
`;

const Tick = styled.circle`
  fill: ${color('gray200')};
`;

const Point = styled.circle`
  stroke: ${color('blue400')};
  fill: ${color('white')};
  stroke-width: 1px;
`;

const InnerPoint = styled.circle`
  fill: ${color('gray200')};
`;

const PointLayer = styled.g`
  cursor: pointer;
  &:hover ${Point} {
    fill: ${color('blue400')};
  }
`;

const SparkTimeline = props => {
  const [ref, { width }] = useMeasure();

  const data = props.data || [];
  const r = 6;
  const tickRadius = 1;
  const commitRadius = 4;
  const x = scaleLinear()
    .domain([0, 24])
    .range([0, width]);

  return (
    <Container ref={ref}>
      <svg width={width} height={r * 2}>
        <g transform={`translate(${r}, ${r})`}>
          {range(24).map(n => (
            <Tick key={n} r={tickRadius} cx={x(n)} />
          ))}
          {data.map(({ ts, n }) => (
            <PointLayer transform={`translate(${x(ts)}, 0)`} key={ts}>
              {n > 1 && <Point cy={3} r={commitRadius} />}
              <Point r={commitRadius} />
              <InnerPoint r={tickRadius} />
            </PointLayer>
          ))}
        </g>
      </svg>
    </Container>
  );
};

SparkTimeline.propTypes = {
  /**
   * Data points
   */
  data: PropTypes.object,
};

SparkTimeline.defaultProps = {
  data: undefined,
};

export default SparkTimeline;
