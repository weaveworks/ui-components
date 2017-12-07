import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import ResizeAware from 'react-resize-aware';
import { clamp, debounce } from 'lodash';
import { drag } from 'd3-drag';
import { event as d3Event, select } from 'd3-selection';
import { Motion } from 'react-motion';

import { strongSpring } from '../../utils/animation';
import {
  formattedTimestamp,
  minDurationMsPerTimelinePx,
  maxDurationMsPerTimelinePx,
} from '../../utils/timeline';
import { zoomFactor } from '../../utils/zooming';
import { TIMELINE_HEIGHT } from '../../constants/timeline';

import TimelinePeriodLabels from './TimelinePeriodLabels';
import TimelineRange from './TimelineRange';


const TimelineWrapper = styled.div`
  width: 100%;
  height: ${TIMELINE_HEIGHT};

  &:before, &:after {
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
const FullyPannableCanvas = styled.svg`
  width: 100%;
  height: 100%;
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;

  ${props => props.panning && `
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  `}
`;

const TimelineContainer = FullyPannableCanvas.extend`
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 0 7px ${props => props.theme.colors.gray};
  pointer-events: all;
`;

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      boundingRect: { width: 0, height: 0 },
      isPanning: false,
      hasPanned: false,
    };

    this.handleZoom = this.handleZoom.bind(this);
    this.handleTimelinePanStart = this.handleTimelinePanStart.bind(this);
    this.handleTimelinePanEnd = this.handleTimelinePanEnd.bind(this);
    this.handleTimelinePan = this.handleTimelinePan.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 200);

    this.saveSvgRef = this.saveSvgRef.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.svg = select(this.svgRef);
    this.drag = drag()
      .on('start', this.handleTimelinePanStart)
      .on('end', this.handleTimelinePanEnd)
      .on('drag', this.handleTimelinePan);
    this.svg.call(this.drag);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleTimelinePanStart() {
    this.setState({ isPanning: true });
  }

  handleTimelinePanEnd() {
    if (this.state.hasPanned) {
      this.props.onRelease();
    }
    this.setState({ isPanning: false, hasPanned: false });
  }

  handleTimelinePan() {
    const dragDurationMs = -this.props.durationMsPerPixel * d3Event.dx;
    const momentTimestamp = moment(this.props.focusedTimestamp).add(dragDurationMs);

    this.props.onPan(formattedTimestamp(momentTimestamp));
    this.setState({ hasPanned: true });
  }

  handleZoom(ev) {
    const minDurationMs = minDurationMsPerTimelinePx();
    const maxDurationMs = maxDurationMsPerTimelinePx(this.props.earliestTimestamp);

    let durationMsPerPixel = this.props.durationMsPerPixel / zoomFactor(ev);
    durationMsPerPixel = clamp(durationMsPerPixel, minDurationMs, maxDurationMs);

    this.props.onZoom(durationMsPerPixel);
    ev.preventDefault();
  }

  handleResize() {
    const boundingRect = this.svgRef.getBoundingClientRect();

    this.props.onResize(boundingRect.width);
    this.setState({ boundingRect });
  }

  saveSvgRef(ref) {
    this.svgRef = ref;
  }

  renderAxis(transform) {
    const { width, height } = this.state.boundingRect;
    const { focusedTimestamp, durationMsPerPixel, rangeMs } = transform;
    const startTimestamp = moment(focusedTimestamp).subtract(rangeMs).utc().format();

    return (
      <g className="axis">
        <rect
          className="tooltip-container"
          transform={`translate(${-width / 2}, 0)`}
          width={width}
          height={height}
          fillOpacity={0}
        />

        <TimelineRange
          color="#aaa"
          focusedTimestamp={focusedTimestamp}
          durationMsPerPixel={durationMsPerPixel}
          endAt={this.props.earliestTimestamp}
          width={width} height={height}
        />
        <TimelineRange
          color="#aaa"
          focusedTimestamp={focusedTimestamp}
          durationMsPerPixel={durationMsPerPixel}
          startAt={this.props.timestampNow}
          width={width} height={height}
        />
        {this.props.inspectingInterval && <TimelineRange
          color="#00d2ff"
          focusedTimestamp={focusedTimestamp}
          durationMsPerPixel={durationMsPerPixel}
          startAt={startTimestamp}
          endAt={focusedTimestamp}
          width={width} height={height}
        />}

        <g className="ticks" transform="translate(0, 1)">
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
        </g>
      </g>
    );
  }

  render() {
    const { isPanning, boundingRect } = this.state;
    const { focusedTimestamp, durationMsPerPixel, rangeMs } = this.props;
    const { width } = boundingRect;

    return (
      <TimelineWrapper>
        <ResizeAware
          onlyEvent onResize={this.handleResize}
          style={{ width: '100%', height: '100%' }}
        >
          <TimelineContainer
            panning={isPanning}
            innerRef={this.saveSvgRef}
            onWheel={this.handleZoom}
          >
            <g className="timeline-container" transform={`translate(${width / 2}, 0)`}>
              <title>Scroll to zoom, drag to pan</title>
              <Motion
                style={{
                  focusedTimestampMs: strongSpring(moment(focusedTimestamp).valueOf()),
                  durationMsPerPixel: strongSpring(durationMsPerPixel),
                  rangeMs: strongSpring(rangeMs),
                }}>
                {interpolated => this.renderAxis({
                  focusedTimestamp: formattedTimestamp(interpolated.focusedTimestampMs),
                  durationMsPerPixel: interpolated.durationMsPerPixel,
                  rangeMs: interpolated.rangeMs,
                })}
              </Motion>
            </g>
          </TimelineContainer>
        </ResizeAware>
      </TimelineWrapper>
    );
  }
}

export default Timeline;
