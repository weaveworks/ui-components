import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { drag } from 'd3-drag';
import { event as d3Event, select } from 'd3-selection';
import { Motion } from 'react-motion';

import theme from '../../theme';
import { strongSpring } from '../../utils/animation';
import { formattedTimestamp, getTimeScale } from '../../utils/timeline';
import { zoomFactor } from '../../utils/zooming';

import TimelinePeriodLabels from './_TimelinePeriodLabels';
import TimelineRange from './_TimelineRange';

const TIMELINE_HEIGHT = '55px';

const TimelineWrapper = styled.div`
  height: ${TIMELINE_HEIGHT};
  width: 100%;

  &:before,
  &:after {
    border: 1px solid ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.accent.orange};
    box-sizing: border-box;
    content: '';
    pointer-events: none;
    position: absolute;
    display: block;
    left: 50%;
    border-top: 0;
    border-bottom: 0;
    margin-left: -1px;
    width: 3px;
    z-index: 1;
  }

  &:before {
    top: 0;
    height: ${TIMELINE_HEIGHT};
  }

  &:after {
    top: ${TIMELINE_HEIGHT};
    height: 9px;
    opacity: 0.15;
  }
`;

// From https://stackoverflow.com/a/18294634
const FullyPannableCanvas = styled.div`
  width: 100%;
  height: 100%;
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;

  ${props =>
    props.panning &&
    `
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  `};
`;

const TimelineContainer = FullyPannableCanvas.extend`
  background-color: ${props => transparentize(0.15, props.theme.colors.white)};
  box-shadow: inset 0 0 7px ${props => props.theme.colors.gray};
  pointer-events: all;
  position: relative;
  overflow: hidden;
`;

const CenteredContent = styled.div`
  position: absolute;
  left: 50%;
  width: 100%;
  height: 100%;
`;

const AxisContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const TicksContainer = styled.div`
  position: absolute;
  top: 1px;
`;

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPanning: false,
      hasPanned: false,
    };
  }

  componentDidMount() {
    this.svg = select(this.svgRef);
    this.drag = drag()
      .on('start', this.handlePanStart)
      .on('end', this.handlePanEnd)
      .on('drag', this.handlePan);
    this.svg.call(this.drag);
  }

  handlePanStart = () => {
    this.setState({ isPanning: true });
  };

  handlePanEnd = () => {
    if (this.state.hasPanned) {
      this.props.onRelease();
    }
    this.setState({ isPanning: false, hasPanned: false });
  };

  handlePan = () => {
    const timeScale = getTimeScale(this.props);
    const momentTimestamp = timeScale.invert(-d3Event.dx);
    this.props.onPan(momentTimestamp);
    this.setState({ hasPanned: true });
  };

  handleZoom = ev => {
    const { durationMsPerPixel } = this.props;
    this.props.onZoom(durationMsPerPixel / zoomFactor(ev));
    ev.preventDefault();
  };

  saveSvgRef = ref => {
    this.svgRef = ref;
  };

  renderAxis(transform) {
    const { focusedTimestamp, rangeMs } = transform;
    const startTimestamp = moment(focusedTimestamp)
      .subtract(rangeMs)
      .format();
    const timeScale = getTimeScale(transform);

    return (
      <AxisContainer>
        <TimelineRange
          color={theme.colors.gray}
          endAt={this.props.earliestTimestamp}
          timeScale={timeScale}
        />
        <TimelineRange
          color={theme.colors.gray}
          startAt={this.props.timestampNow}
          timeScale={timeScale}
        />
        {this.props.inspectingInterval && (
          <TimelineRange
            color={theme.colors.accent.blue}
            startAt={startTimestamp}
            endAt={focusedTimestamp}
            timeScale={timeScale}
          />
        )}
        <TicksContainer>
          {['year', 'month', 'day', 'minute'].map(period => (
            <TimelinePeriodLabels
              key={period}
              period={period}
              onClick={this.props.onJump}
              clickableStartAt={this.props.earliestTimestamp}
              clickableEndAt={this.props.timestampNow}
              {...transform}
            />
          ))}
        </TicksContainer>
      </AxisContainer>
    );
  }

  render() {
    const { isPanning } = this.state;
    const { focusedTimestamp, durationMsPerPixel, rangeMs } = this.props;

    return (
      <TimelineWrapper>
        <TimelineContainer
          panning={isPanning}
          innerRef={this.saveSvgRef}
          onWheel={this.handleZoom}
          title="Scroll to zoom, drag to pan"
        >
          <CenteredContent>
            <Motion
              style={{
                focusedTimestampMs: strongSpring(
                  moment(focusedTimestamp).valueOf()
                ),
                durationMsPerPixel: strongSpring(durationMsPerPixel),
                rangeMs: strongSpring(rangeMs),
              }}
            >
              {interpolated =>
                this.renderAxis({
                  focusedTimestamp: formattedTimestamp(
                    interpolated.focusedTimestampMs
                  ),
                  durationMsPerPixel: interpolated.durationMsPerPixel,
                  rangeMs: interpolated.rangeMs,
                })
              }
            </Motion>
          </CenteredContent>
        </TimelineContainer>
      </TimelineWrapper>
    );
  }
}

Timeline.propTypes = {
  inspectingInterval: PropTypes.bool.isRequired,
  timestampNow: PropTypes.string.isRequired,
  focusedTimestamp: PropTypes.string.isRequired,
  earliestTimestamp: PropTypes.string,
  durationMsPerPixel: PropTypes.number.isRequired,
  rangeMs: PropTypes.number.isRequired,
  onJump: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
  onPan: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
};

export default Timeline;
