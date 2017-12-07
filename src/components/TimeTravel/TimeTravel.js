import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ResizeAware from 'react-resize-aware';
import { clamp, find, debounce } from 'lodash';
import { drag } from 'd3-drag';
import { event as d3Event, select } from 'd3-selection';
import { Motion } from 'react-motion';

import { strongSpring } from '../../utils/animation';
import { zoomFactor } from '../../utils/zooming';
import {
  formattedTimestamp,
  initialDurationMsPerTimelinePx,
  minDurationMsPerTimelinePx,
  maxDurationMsPerTimelinePx,
} from '../../utils/timeline';

import TimelinePeriodLabels from './TimelinePeriodLabels';
import TimelineRange from './TimelineRange';
import LiveModeToggle from './LiveModeToggle';
import TimestampInput from './TimestampInput';
import RangeSelector from './RangeSelector';

import {
  TIMELINE_HEIGHT,
  MAX_TICK_SPACING_PX,
} from '../../constants/timeline';
import {
  ZOOM_TRACK_DEBOUNCE_INTERVAL,
  TIMELINE_DEBOUNCE_INTERVAL,
  TIMELINE_TICK_INTERVAL,
} from '../../constants/timer';


const TimeTravelContainer = styled.div`
  transition: all .15s ease-in-out;
  position: relative;
  overflow: hidden;
  z-index: 1;
  height: 0;

  ${props => props.visible && `
    height: calc(${TIMELINE_HEIGHT} + 38px);
  `}
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

const TimelineContainer = styled.div`
  align-items: center;
  display: flex;
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

const Timeline = FullyPannableCanvas.extend`
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 0 7px ${props => props.theme.colors.gray};
  pointer-events: all;
`;

const TimelinePanButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary.lavender};
  cursor: pointer;
  font-size: 13px;
  pointer-events: all;
  padding: 2px;
  outline: 0;
  border: 0;

  &:hover {
    color: ${props => props.theme.colors.primary.charcoal};
  }
`;

const TimeControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 25px;
`;

const TimeControlsContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.neutral.lightgray};
  background-color: ${props => props.theme.colors.white};
  border-radius: 5px;
  display: flex;
`;


/**
 * A visual component used for time travelling between different states in the system.
 *
 * To make it behave correctly, it requires a `timestamp` (can initially be `null`)
 * which gets updated with `onChangeTimestamp`.
 *
 * Optional features include:
 *   * Auto-update live mode on top of the default paused mode
 *   * Range selection instead of the default point-in-time selection
 *
 * ```javascript
 *  import React from 'react';
 *  import moment from 'moment';
 *
 *  import { TimeTravel } from 'weaveworks-ui-components';
 *
 *  export default class TimeTravelExample extends React.Component {
 *    constructor() {
 *      super();
 *
 *      this.state = {
 *        timestamp: moment().format(),
 *      };
 *
 *      this.handleChangeTimestamp = this.handleChangeTimestamp.bind(this);
 *    }
 *
 *    handleChangeTimestamp(timestamp) {
 *      this.setState({ timestamp });
 *    }
 *
 *    handleTimestampInputEdit() {
 *      // track timestamp input edit...
 *    }
 *
 *    handleTimestampLabelClick() {
 *      // track timestamp label click...
 *    }
 *
 *    handleTimelinePan() {
 *      // track timeline pan...
 *    }
 *
 *    // zoomedPeriod is one of: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']
 *    handleTimelineZoom(zoomedPeriod) {
 *      // track timeline zoom...
 *    }
 *
 *    render() {
 *      return (
 *        <TimeTravel
 *          timestamp={this.state.timestamp}
 *          onChangeTimestamp={this.handleChangeTimestamp}
 *          onTimestampInputEdit={this.handleTimestampInputEdit}
 *          onTimestampLabelClick={this.handleTimestampLabelClick}
 *          onTimelineZoom={this.handleTimelineZoom}
 *          onTimelinePan={this.handleTimelinePan}
 *        />
 *      );
 *    }
 *  }
 * ```
 *
*/
class TimeTravel extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      rangeMs: props.rangeMs,
      timestampNow: formattedTimestamp(),
      focusedTimestamp: formattedTimestamp(props.timestamp),
      durationMsPerPixel: initialDurationMsPerTimelinePx(props.earliestTimestamp),
      boundingRect: { width: 0, height: 0 },
      showingLive: props.showingLive,
      isPanning: false,
    };

    this.jumpRelativePixels = this.jumpRelativePixels.bind(this);
    this.handleJumpForward = this.handleJumpForward.bind(this);
    this.handleJumpBackward = this.handleJumpBackward.bind(this);
    this.jumpTo = this.jumpTo.bind(this);

    this.handleZoom = this.handleZoom.bind(this);
    this.handleTimelinePanStart = this.handleTimelinePanStart.bind(this);
    this.handleTimelinePanEnd = this.handleTimelinePanEnd.bind(this);
    this.handleTimelinePan = this.handleTimelinePan.bind(this);

    this.saveSvgRef = this.saveSvgRef.bind(this);
    this.debouncedTrackZoom = debounce(this.trackZoom.bind(this), ZOOM_TRACK_DEBOUNCE_INTERVAL);

    this.handleResize = debounce(this.handleResize.bind(this), 200);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleLiveModeToggle = this.handleLiveModeToggle.bind(this);

    this.setTimestampFromProps = this.setTimestampFromProps.bind(this);
    this.instantUpdateTimestamp = this.instantUpdateTimestamp.bind(this);
    this.instantTimestampUpdateCallbacks = this.instantTimestampUpdateCallbacks.bind(this);
    this.debouncedTimestampUpdateCallbacks = debounce(
      this.instantTimestampUpdateCallbacks.bind(this),
      TIMELINE_DEBOUNCE_INTERVAL
    );
  }

  componentDidMount() {
    this.svg = select(this.svgRef);
    this.drag = drag()
      .on('start', this.handleTimelinePanStart)
      .on('end', this.handleTimelinePanEnd)
      .on('drag', this.handleTimelinePan);
    this.svg.call(this.drag);

    // Force periodic updates of the availability range as time goes by.
    this.timer = setInterval(() => {
      const timestampNow = formattedTimestamp();
      this.setState({ timestampNow });

      if (this.props.hasLiveMode && this.state.showingLive) {
        this.setState({ focusedTimestamp: timestampNow });
      }
    }, TIMELINE_TICK_INTERVAL);
  }

  componentWillMount() {
    this.setTimestampFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setTimestampFromProps(nextProps);
    this.setState({ rangeMs: nextProps.rangeMs });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  setTimestampFromProps({ timestamp, showingLive }) {
    // Don't update the timestamp if in live mode.
    if (this.props.hasLiveMode && showingLive) return;

    // Keep the most recent live timestamp if just switched from live to paused.
    if (!showingLive && this.props.showingLive) return;

    // Don't update the focused timestamp if we're not paused (so the timeline is hidden).
    if (timestamp) {
      this.setState({ focusedTimestamp: timestamp });
    }
  }

  clampedTimestamp(timestamp) {
    const startTimestamp = this.props.earliestTimestamp;
    const endTimestamp = this.state.timestampNow;
    if (timestamp < startTimestamp) timestamp = startTimestamp;
    if (timestamp > endTimestamp) timestamp = endTimestamp;
    return timestamp;
  }

  shouldStickySwitchToLiveMode() {
    const momentFocusedTimestamp = moment(this.state.focusedTimestamp).utc();
    const diffDurationMs = moment().utc().diff(momentFocusedTimestamp);
    const pixelsToEndTime = diffDurationMs / this.state.durationMsPerPixel;
    return pixelsToEndTime < 10 && this.props.hasLiveMode && !this.state.showingLive;
  }

  handleResize(boundingRect) {
    // Update the timeline dimension information.
    this.setState({ boundingRect });
  }

  handleRangeChange(rangeMs) {
    this.props.onChangeRange(rangeMs);
    this.setState({ rangeMs });

    const minDurationMs = minDurationMsPerTimelinePx();
    const maxDurationMs = maxDurationMsPerTimelinePx(this.props.earliestTimestamp);
    let durationMsPerPixel = rangeMs / (this.state.boundingRect.width / 3);
    durationMsPerPixel = clamp(durationMsPerPixel, minDurationMs, maxDurationMs);
    this.setState({ durationMsPerPixel });
  }

  handleInputChange(timestamp) {
    const clampedTimestamp = this.clampedTimestamp(timestamp);
    if (clampedTimestamp !== this.state.focusedTimestamp) {
      this.instantUpdateTimestamp(clampedTimestamp, this.props.onTimestampInputEdit);
    }
  }

  handleTimelinePanStart() {
    this.setState({ isPanning: true });
    this.setLiveMode(false);
  }

  handleTimelinePanEnd() {
    this.setState({ isPanning: false });

    if (this.shouldStickySwitchToLiveMode()) {
      this.setLiveMode(true);
      this.instantUpdateTimestamp(this.state.timestampNow, this.props.onTimelinePan);
    } else {
      this.instantUpdateTimestamp(this.state.focusedTimestamp, this.props.onTimelinePan);
    }
  }

  handleTimelinePan() {
    const dragDurationMs = -this.state.durationMsPerPixel * d3Event.dx;
    const momentTimestamp = moment(this.state.focusedTimestamp).add(dragDurationMs);
    const timestamp = this.clampedTimestamp(formattedTimestamp(momentTimestamp));

    this.setState({ focusedTimestamp: timestamp });
    this.debouncedTimestampUpdateCallbacks(timestamp);
  }

  handleZoom(ev) {
    const minDurationMs = minDurationMsPerTimelinePx();
    const maxDurationMs = maxDurationMsPerTimelinePx(
      this.props.earliestTimestamp,
      this.state.rangeMs,
    );

    let durationMsPerPixel = this.state.durationMsPerPixel / zoomFactor(ev);
    durationMsPerPixel = clamp(durationMsPerPixel, minDurationMs, maxDurationMs);

    this.setState({ durationMsPerPixel });
    this.debouncedTrackZoom();
    ev.preventDefault();
  }

  handleLiveModeToggle(showingLive) {
    this.setLiveMode(showingLive);
    if (showingLive) {
      this.setState({ focusedTimestamp: this.state.timestampNow });
    }
  }

  instantTimestampUpdateCallbacks(timestamp, callback) {
    // Used for tracking.
    if (callback) callback();
    this.props.onChangeTimestamp(timestamp);
  }

  instantUpdateTimestamp(timestamp, callback) {
    if (timestamp !== this.state.focusedTimestamp) {
      this.debouncedTimestampUpdateCallbacks.cancel();
      this.instantTimestampUpdateCallbacks(timestamp, callback);
      this.setState({ focusedTimestamp: timestamp });
    }
  }

  setLiveMode(showingLive) {
    if (showingLive !== this.state.showingLive) {
      this.setState({ showingLive });
      if (this.props.onChangeLiveMode) {
        this.props.onChangeLiveMode(showingLive);
      }
    }
  }

  saveSvgRef(ref) {
    this.svgRef = ref;
  }

  trackZoom() {
    const periods = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    const momentDuration = moment.duration(this.state.durationMsPerPixel * MAX_TICK_SPACING_PX);
    const zoomedPeriod = find(periods, period => Math.floor(momentDuration.get(period)) && period);
    if (this.props.onTimelineZoom) {
      this.props.onTimelineZoom(zoomedPeriod);
    }
  }

  jumpTo(timestamp) {
    this.setLiveMode(false);
    this.instantUpdateTimestamp(this.clampedTimestamp(timestamp), this.props.onTimestampLabelClick);
  }

  jumpRelativePixels(pixels) {
    const durationMs = this.state.durationMsPerPixel * pixels;
    const momentTimestamp = moment(this.state.focusedTimestamp).add(durationMs);
    this.jumpTo(formattedTimestamp(momentTimestamp));
  }

  handleJumpForward() {
    // TODO: Consider making this action sticky-transition to live mode as well.
    this.jumpRelativePixels(this.state.boundingRect.width / 4);
  }

  handleJumpBackward() {
    this.jumpRelativePixels(-this.state.boundingRect.width / 4);
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
          startAt={this.state.timestampNow}
          width={width} height={height}
        />
        {this.props.hasRangeSelector && <TimelineRange
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
              onClick={this.jumpTo}
              clickableStartAt={this.props.earliestTimestamp}
              clickableEndAt={this.state.timestampNow}
              {...transform}
            />
          ))}
        </g>
      </g>
    );
  }

  renderAnimatedContent() {
    const { focusedTimestamp, durationMsPerPixel, rangeMs } = this.state;
    return (
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
    );
  }

  render() {
    const { isPanning, boundingRect } = this.state;
    const halfWidth = boundingRect.width / 2;

    return (
      <TimeTravelContainer className="time-travel" visible={this.props.visible}>
        <TimelineContainer className="time-travel-timeline">
          <TimelinePanButton onClick={this.handleJumpBackward}>
            <span className="fa fa-chevron-left" />
          </TimelinePanButton>
          <ResizeAware
            onlyEvent onResize={this.handleResize}
            style={{ width: '100%', height: '100%' }}
          >
            <Timeline panning={isPanning} innerRef={this.saveSvgRef} onWheel={this.handleZoom}>
              <g className="timeline-container" transform={`translate(${halfWidth}, 0)`}>
                <title>Scroll to zoom, drag to pan</title>
                {this.renderAnimatedContent()}
              </g>
            </Timeline>
          </ResizeAware>
          <TimelinePanButton onClick={this.handleJumpForward}>
            <span className="fa fa-chevron-right" />
          </TimelinePanButton>
        </TimelineContainer>
        <TimeControlsWrapper>
          <TimeControlsContainer>
            {this.props.hasLiveMode && <LiveModeToggle
              showingLive={this.state.showingLive}
              onToggle={this.handleLiveModeToggle}
            />}
            <TimestampInput
              timestamp={this.state.focusedTimestamp}
              onChangeTimestamp={this.handleInputChange}
              disabled={this.props.hasLiveMode && this.state.showingLive}
            />
            {this.props.hasRangeSelector && <RangeSelector
              rangeMs={this.state.rangeMs}
              onChange={this.handleRangeChange}
            />}
          </TimeControlsContainer>
        </TimeControlsWrapper>
      </TimeTravelContainer>
    );
  }
}

// TODO: Consider removing `showingLive` property. See the PR comment for details:
// https://github.com/weaveworks/ui-components/pull/68#discussion_r152771727
TimeTravel.propTypes = {
  /**
   * Shows Time Travel component
   */
  visible: PropTypes.bool,
  /**
   * The timestamp in focus
   */
  timestamp: PropTypes.string,
  /**
   * The earliest timestamp we can travel back in time to
   */
  earliestTimestamp: PropTypes.string,
  /**
   * Required callback handling every timestamp change
   */
  onChangeTimestamp: PropTypes.func.isRequired,
  /**
   * Optional callback handling timestamp change by direct input box editing (e.g. for tracking)
   */
  onTimestampInputEdit: PropTypes.func,
  /**
   * Optional callback handling clicks on timeline timestamp labels (e.g. for tracking)
   */
  onTimestampLabelClick: PropTypes.func,
  /**
   * Optional callback handling timeline zooming (e.g. for tracking)
   */
  onTimelineZoom: PropTypes.func,
  /**
   * Optional callback handling timeline panning (e.g. for tracking)
   */
  onTimelinePan: PropTypes.func,
  /**
   * Enables Time Travel to be in the live auto-update mode
   */
  hasLiveMode: PropTypes.bool,
  /**
   * The live mode shows current time and ignores the `timestamp` param
   */
  showingLive: PropTypes.bool,
  /**
   * Optional callback handling the change of live mode
   */
  onChangeLiveMode: PropTypes.func,
  /**
   * Adds a range selector to the timestamp selector, for when the timestamp info is not enough
   */
  hasRangeSelector: PropTypes.bool,
  /**
   * Duration in milliseconds of the focused range (which ends at `timestamp`)
   */
  rangeMs: PropTypes.number,
  /**
   * Optional callback handling range in milliseconds change
   */
  onChangeRange: PropTypes.func,
};

TimeTravel.defaultProps = {
  visible: true,
  earliestTimestamp: '2014-01-01T00:00:00Z',
  hasLiveMode: false,
  showingLive: true, // only relevant if live mode is enabled
  hasRangeSelector: false,
  rangeMs: 3600000, // 1 hour as a default, only relevant if range selector is enabled
};

export default TimeTravel;
