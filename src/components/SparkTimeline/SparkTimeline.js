import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { entries, groupBy, range } from 'lodash';
import { scaleLinear } from 'd3-scale';
import { useMeasure } from 'react-use';

import { color } from '../../theme/selectors';

const Container = styled.div`
  width: 100%;
  height: 100%;

  svg {
    overflow: visible;
  }

  font-family: sans-serif;
  font-size: 11px;
`;

const Tick = styled.line`
  stroke: ${color('gray100')};
`;

const MajorTick = styled.line`
  stroke: ${color('gray100')};
`;

const statusColor = props => {
  const c =
    {
      success: 'green500',
      fail: 'orange500',
    }[props.status] || 'gray200';
  return color(c)(props);
};

const Point = styled.circle`
  stroke: ${statusColor};
  fill: ${color('white')};
  stroke-width: 2px;
`;

const PointLayer = styled.g`
  cursor: pointer;
  &:hover ${Point} {
    fill: ${statusColor};
  }
`;

const HeadText = styled.text`
  && {
    color: ${color('gray200')};
    font-size: 9px;
  }
`;

const SvgCanvas = styled.svg`
  text {
    opacity: ${props => (props.axisOnHover ? 0 : 1)};
    cursor: default;
    transition: opacity 0.2s linear;
    color: ${color('gray600')};
  }
  &:hover {
    ${MajorTick} {
      stroke: ${color('gray200')};
      stroke-width: 2px;
    }
    text {
      opacity: 1;
    }
  }
`;

/*
Expects:
- Data: [ { id: string, ts: Date } ]
*/

const SparkTimeline = ({ data, ...props }) => {
  const groupedData = entries(groupBy(data, d => d.ts)).map(([k, v]) => {
    return { ts: k, n: v.length, statuses: v.map(d => d.status) };
  });
  return <SparkTimelineInner data={groupedData} {...props} />;
};

/*
Expects:
- Data: [ { ts: [0..25], n } ]
*/

const SparkTimelineInner = ({ axisOnHover, data, showHeadLabel }) => {
  const [ref, { width }] = useMeasure();

  const { true: outOfRange, false: inRange } = groupBy(data, d => d.ts >= 24);
  const points = inRange || [];
  const older = outOfRange || [];

  const commitRadius = 4;
  // FIXME: lookup how to do innerStroke
  const commitStrokeWidth = 2;
  const height = (commitRadius + commitStrokeWidth) * 2 + 14 * 2;
  // Keep the circles inside the canvas at least..
  const padding = commitRadius;
  const olderCommitPadding = 24;
  const innerWidth = width - padding * 2;
  const x = scaleLinear()
    .domain([23, 0])
    .range([0, innerWidth - olderCommitPadding]);

  const oldCommit = older[0];
  const lastCommit = points[0];
  const headOffset = lastCommit ? x(lastCommit.ts) + olderCommitPadding : 0;
  const noCommits = !oldCommit && !lastCommit;

  return (
    <Container ref={ref}>
      <SvgCanvas axisOnHover={axisOnHover} width={width} height={height}>
        <g transform={`translate(${padding}, 22)`}>
          <text
            fill="currentColor"
            x={olderCommitPadding}
            y="10"
            textAnchor="middle"
            dy="0.71em"
          >
            24h
          </text>
          <text
            fill="currentColor"
            x={innerWidth}
            y="10"
            textAnchor="middle"
            dy="0.71em"
          >
            now
          </text>
          {!noCommits && showHeadLabel && (
            <HeadText
              fill="currentColor"
              x={headOffset}
              textAnchor="middle"
              y="-18"
              dy="0.71em"
            >
              HEAD
            </HeadText>
          )}
          {oldCommit && (
            <>
              <text fill="currentColor" y="10" textAnchor="middle" dy="0.71em">
                3d
              </text>
              <PointLayer status={oldCommit.statuses[0]}>
                <Point status={oldCommit.statuses[0]} r={commitRadius} />
              </PointLayer>
            </>
          )}
          <g transform={`translate(${olderCommitPadding}, 0)`}>
            {range(24).map(ts => (
              <g transform={`translate(${x(ts)}, 0)`} key={ts}>
                {ts == 0 || ts == 23 ? (
                  <MajorTick y1="-3" y2="3" />
                ) : (
                  <Tick y1="-3" y2="3" />
                )}
              </g>
            ))}
            {points.map(({ ts, n, statuses }) => (
              <PointLayer
                status={statuses[0]}
                transform={`translate(${x(ts)}, 0)`}
                key={ts}
              >
                {n > 1 && (
                  <Point cy={3} status={statuses[0]} r={commitRadius} />
                )}
                <Point status={statuses[0]} r={commitRadius} />
              </PointLayer>
            ))}
          </g>
        </g>
      </SvgCanvas>
    </Container>
  );
};

SparkTimeline.propTypes = {
  /**
   * Data points
   */
  data: PropTypes.array,
  /**
   * Axis on hover
   */
  axisOnHover: PropTypes.bool,
  /**
   * Axis on hover
   */
  showHeadLabel: PropTypes.bool,
};

SparkTimeline.defaultProps = {
  axisOnHover: true,
  showHeadLabel: true,
  data: undefined,
};

export default SparkTimeline;
