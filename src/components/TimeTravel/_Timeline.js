import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ResizeAware from 'react-resize-aware';
import { transparentize } from 'polished';
import { debounce } from 'lodash';
import { drag } from 'd3-drag';
import { event as d3Event, select } from 'd3-selection';
import { Motion } from 'react-motion';

import { strongSpring } from '../../utils/animation';
import { formattedTimestamp, getTimeScale } from '../../utils/timeline';
import { zoomFactor } from '../../utils/zooming';
import theme from '../../theme';

import TimelineLoader from './_TimelineLoader';
import TimelineDeployments from './_TimelineDeployments';
import TimelinePeriodLabels from './_TimelinePeriodLabels';
import TimelineRange from './_TimelineRange';

const TIMELINE_HEIGHT = '55px';

const TimelineWrapper = styled.div`
  width: 100%;
  height: ${TIMELINE_HEIGHT};

  &:before,
  &:after {
    border: 1px solid ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.accent.orange};
    z-index: ${props => props.theme.layers.front};
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
  height: 100%;
`;

const TimelineContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OverflowHidden = styled.div`
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const CenteredContent = styled.div`
  left: ${props => props.width / 2}px;
  pointer-events: none;
  position: absolute;
  height: 100%;
`;

const TimelinePeriodLabelsWrapper = styled.div`
  transform: translateY(1px);
  position: absolute;
`;

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      isPanning: false,
      hasPanned: false,
    };

    this.delayedHandleResize = debounce(this.handleResize, 200);
    this.delayedUpdateVisibleRange = debounce(this.updateVisibleRange, 200);
  }

  componentDidMount() {
    this.svg = select(this.svgRef);
    this.drag = drag()
      .on('start', this.handlePanStart)
      .on('end', this.handlePanEnd)
      .on('drag', this.handlePan);
    this.svg.call(this.drag);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rangeMs !== nextProps.rangeMs) {
      this.delayedUpdateVisibleRange();
    }
  }

  handlePanStart = () => {
    this.setState({ isPanning: true });
  };

  handlePanEnd = () => {
    if (this.state.hasPanned) {
      this.props.onRelease();
    }
    this.setState({ isPanning: false, hasPanned: false });
    this.delayedUpdateVisibleRange();
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
    this.delayedUpdateVisibleRange();
    ev.preventDefault();
  };

  handleResize = ({ width }) => {
    // Update the timeline dimension information.
    this.setState({ width });
    this.delayedUpdateVisibleRange();
    this.props.onResize(width);
  };

  updateVisibleRange = () => {
    const { width } = this.state;
    const timeScale = getTimeScale(this.props);

    // Update the visible part of the timeline.
    this.props.onUpdateVisibleRange({
      startAt: moment(timeScale.invert(-width / 2))
        .utc()
        .format(),
      endAt: moment(timeScale.invert(width / 2))
        .utc()
        .format(),
    });
  };

  saveSvgRef = ref => {
    this.svgRef = ref;
  };

  renderContent(transform) {
    const { width } = this.state;
    const { focusedTimestamp, rangeMs } = transform;
    const startTimestamp = moment(focusedTimestamp)
      .subtract(rangeMs)
      .format();
    const timeScale = getTimeScale(transform);

    return (
      <TimelineContent>
        <CenteredContent width={width}>
          <TimelineDeployments
            deployments={this.props.deployments}
            timeScale={timeScale}
            width={width}
          />
        </CenteredContent>
        <OverflowHidden>
          <CenteredContent width={width}>
            <TimelineRange
              color={theme.colors.gray}
              endAt={this.props.earliestTimestamp}
              timeScale={timeScale}
              width={width}
            />
            <TimelineRange
              color={theme.colors.gray}
              startAt={this.props.timestampNow}
              timeScale={timeScale}
              width={width}
            />
            {this.props.inspectingInterval && (
              <TimelineRange
                color={theme.colors.accent.blue}
                startAt={startTimestamp}
                endAt={focusedTimestamp}
                timeScale={timeScale}
                width={width}
              />
            )}

            <TimelinePeriodLabelsWrapper>
              {['year', 'month', 'day', 'minute'].map(period => (
                <TimelinePeriodLabels
                  key={period}
                  period={period}
                  width={width}
                  onClick={this.props.onJump}
                  clickableStartAt={this.props.earliestTimestamp}
                  clickableEndAt={this.props.timestampNow}
                  {...transform}
                />
              ))}
            </TimelinePeriodLabelsWrapper>

            {this.props.isLoading && (
              <TimelineLoader
                startAt={this.props.earliestTimestamp}
                endAt={this.props.timestampNow}
                timeScale={timeScale}
                width={width}
              />
            )}
          </CenteredContent>
        </OverflowHidden>
      </TimelineContent>
    );
  }

  render() {
    const { isPanning } = this.state;
    const { focusedTimestamp, durationMsPerPixel, rangeMs } = this.props;

    return (
      <TimelineWrapper>
        <ResizeAware
          onlyEvent
          onResize={this.delayedHandleResize}
          style={{ width: '100%', height: '100%' }}
        >
          <TimelineContainer
            panning={isPanning}
            innerRef={this.saveSvgRef}
            onWheel={this.handleZoom}
            title="Scroll to zoom, drag to pan"
          >
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
                this.renderContent({
                  focusedTimestamp: formattedTimestamp(
                    interpolated.focusedTimestampMs
                  ),
                  durationMsPerPixel: interpolated.durationMsPerPixel,
                  rangeMs: interpolated.rangeMs,
                })
              }
            </Motion>
          </TimelineContainer>
        </ResizeAware>
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
  deployments: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onUpdateVisibleRange: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
  onPan: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default Timeline;
