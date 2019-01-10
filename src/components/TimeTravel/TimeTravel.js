import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { clamp, find, debounce, noop } from 'lodash';

import { spacing } from '../../theme/selectors';
import { formattedTimestamp, getTimeScale } from '../../utils/timeline';

import { MAX_TICK_SPACING_PX } from './_TimelinePeriodLabels';
import Timeline from './_Timeline';
import TimelinePanButton from './_TimelinePanButton';
import LiveModeToggle from './_LiveModeToggle';
import TimestampInput from './_TimestampInput';
import RangeSelector from './_RangeSelector';

// Initial selected range size.
const INITIAL_RANGE_WIDTH_PX = 200;

const TimeTravelContainer = styled.div`
  position: relative;
`;

const TimelineBar = styled.div`
  align-items: center;
  display: flex;
`;

const TimeControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${spacing('xs')} 0 ${spacing('medium')};
`;

const TimeControlsContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.gray200};
  box-shadow: 0 0 2px ${props => props.theme.colors.gray200};
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.soft};
  display: flex;
`;

function availableTimelineDurationMs(earliestTimestamp) {
  const earliestMomentTimestamp = moment(earliestTimestamp);
  const currentMomentTimestamp = moment(formattedTimestamp());
  return currentMomentTimestamp.diff(earliestMomentTimestamp);
}

// The most granular zoom is 2px per second, probably we don't want any more granular than that.
function minDurationMsPerTimelinePx() {
  return moment.duration(500, 'milliseconds').asMilliseconds();
}

// Maximum level we can zoom out is such that the available range takes 400px. The 3 days
// per pixel upper bound on that scale is to prevent ugly rendering in extreme cases.
function maxDurationMsPerTimelinePx(earliestTimestamp) {
  const durationMsLowerBound = minDurationMsPerTimelinePx();
  const durationMsUpperBound = moment.duration(3, 'days').asMilliseconds();
  const durationMs = availableTimelineDurationMs(earliestTimestamp) / 400.0;
  return clamp(durationMs, durationMsLowerBound, durationMsUpperBound);
}

// The initial zoom level is set to be 10% of the max zoom out level capped at 1px per minute,
// with the assumption that if we have a long recorded history, we're in most cases by
// default going to be interested in what happened in last couple of hours or so.
function initialDurationMsPerTimelinePx(earliestTimestamp) {
  const durationMsLowerBound = minDurationMsPerTimelinePx();
  const durationMsUpperBound = moment.duration(1, 'minute').asMilliseconds();
  const durationMs = maxDurationMsPerTimelinePx(earliestTimestamp) * 0.1;
  return clamp(durationMs, durationMsLowerBound, durationMsUpperBound);
}

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
 *    handleTimelinePanButtonClick() {
 *      // track timeline pan button click...
 *    }
 *
 *    handleTimelineLabelClick() {
 *      // track timeline label click...
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
 *          onTimelinePanButtonClick={this.handleTimelinePanButtonClick}
 *          onTimelineLabelClick={this.handleTimelineLabelClick}
 *          onTimelineZoom={this.handleTimelineZoom}
 *          onTimelinePan={this.handleTimelinePan}
 *        />
 *      );
 *    }
 *  }
 * ```
 *
 */
class TimeTravel extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      durationMsPerPixel: initialDurationMsPerTimelinePx(
        props.earliestTimestamp
      ),
      focusedTimestamp: formattedTimestamp(props.timestamp),
      rangeMs: props.rangeMs,
      showingLive: props.showingLive,
      timelineWidthPx: null,
      timestampNow: formattedTimestamp(),
    };

    this.delayedReportZoom = debounce(this.reportZoom, 5000);
    this.delayedOnChangeTimestamp = debounce(this.props.onChangeTimestamp, 500);
  }

  componentDidMount() {
    // Force periodic updates of the availability range every 1 second as time goes by.
    this.timer = setInterval(() => {
      const timestampNow = formattedTimestamp();
      this.setState({ timestampNow });

      if (this.props.hasLiveMode && this.state.showingLive) {
        this.setState({ focusedTimestamp: timestampNow });
      }
    }, 1000);

    // Adjust timeline zoom level to the selected range immediately after mounting.
    this.adjustZoomToRange(this.state.rangeMs);
  }

  componentWillReceiveProps(nextProps) {
    const nextTimestamp = formattedTimestamp(nextProps.timestamp);

    // If live mode is supported and we're in it, ignore the timestamp prop and jump
    // directly to the present timestamp, otherwise jump to the given timestamp prop
    // if it has changed (to prevent regressions).
    if (nextProps.hasLiveMode && nextProps.showingLive) {
      this.setState({ focusedTimestamp: this.state.timestampNow });
    } else if (nextTimestamp !== this.props.timestamp) {
      this.setState({ focusedTimestamp: nextTimestamp });
    }
    // Update live mode only if live mode toggle is enabled.
    if (nextProps.hasLiveMode) {
      this.setState({ showingLive: nextProps.showingLive });
    }
    // Update selected range only if range selector is used.
    if (nextProps.hasRangeSelector) {
      this.setState({ rangeMs: nextProps.rangeMs });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  clampedTimestamp(rawTimestamp) {
    let timestamp = formattedTimestamp(rawTimestamp);
    const startTimestamp = this.props.earliestTimestamp;
    const endTimestamp = this.state.timestampNow;
    if (startTimestamp && timestamp < startTimestamp) {
      timestamp = startTimestamp;
    }
    if (endTimestamp && timestamp > endTimestamp) {
      timestamp = endTimestamp;
    }
    return timestamp;
  }

  clampedDuration(duration) {
    const minDurationMs = minDurationMsPerTimelinePx();
    const maxDurationMs = maxDurationMsPerTimelinePx(
      this.props.earliestTimestamp
    );
    return clamp(duration, minDurationMs, maxDurationMs);
  }

  shouldStickySwitchToLiveMode(nextState) {
    const timeScale = getTimeScale({ ...this.state, ...nextState });
    const timestampCloseToNow = timeScale(moment(this.state.timestampNow)) < 10;
    return (
      timestampCloseToNow && this.props.hasLiveMode && !this.state.showingLive
    );
  }

  handleRangeChange = rangeMs => {
    this.setState({ rangeMs });
    this.adjustZoomToRange(rangeMs);
    this.props.onChangeRange(rangeMs);
  };

  handleInputChange = timestamp => {
    this.setFocusedTimestamp(timestamp);
    this.props.onTimestampInputEdit();
  };

  handleTimelineJump = timestamp => {
    // Order of callbacks is important.
    this.switchToPausedMode();
    this.setFocusedTimestamp(timestamp);
    this.props.onTimelineLabelClick();
  };

  handleTimelinePanButtonClick = timestamp => {
    if (this.shouldStickySwitchToLiveMode({ focusedTimestamp: timestamp })) {
      // Order of callbacks is important.
      this.setFocusedTimestamp(this.state.timestampNow);
      this.switchToLiveMode();
    } else {
      // Order of callbacks is important.
      this.switchToPausedMode();
      this.setFocusedTimestamp(timestamp);
    }
    this.props.onTimelinePanButtonClick();
  };

  handleTimelineZoom = duration => {
    const durationMsPerPixel = this.clampedDuration(duration);
    this.setState({ durationMsPerPixel });
    this.delayedReportZoom();
  };

  handleTimelinePan = timestamp => {
    // Order of callbacks is important.
    const focusedTimestamp = this.clampedTimestamp(timestamp);
    this.switchToPausedMode();
    this.setState({ focusedTimestamp });
    this.delayedOnChangeTimestamp(focusedTimestamp);
  };

  handleTimelineRelease = () => {
    if (this.shouldStickySwitchToLiveMode()) {
      // Order of callbacks is important.
      this.setFocusedTimestamp(this.state.timestampNow);
      this.switchToLiveMode();
    }
    this.props.onTimelinePan();
  };

  handleTimelineResize = timelineWidthPx => {
    this.setState({ timelineWidthPx });
  };

  handleLiveModeToggle = showingLive => {
    if (showingLive) {
      // Order of callbacks is important.
      this.setState({ focusedTimestamp: this.state.timestampNow });
      this.switchToLiveMode();
    } else {
      this.switchToPausedMode();
    }
  };

  switchToLiveMode = () => {
    if (this.props.hasLiveMode && !this.state.showingLive) {
      this.setState({ showingLive: true });
      this.props.onChangeLiveMode(true);
    }
  };

  switchToPausedMode = () => {
    if (this.props.hasLiveMode && this.state.showingLive) {
      this.setState({ showingLive: false });
      this.props.onChangeLiveMode(false);
    }
  };

  setFocusedTimestamp = timestamp => {
    const focusedTimestamp = this.clampedTimestamp(timestamp);
    if (focusedTimestamp !== this.state.focusedTimestamp) {
      this.delayedOnChangeTimestamp.cancel();
      this.props.onChangeTimestamp(focusedTimestamp);
      this.setState({ focusedTimestamp });
    }
  };

  adjustZoomToRange = rangeMs => {
    const rawDurationMsPerPixel = rangeMs / INITIAL_RANGE_WIDTH_PX;
    const durationMsPerPixel = this.clampedDuration(rawDurationMsPerPixel);
    this.setState({ durationMsPerPixel });
  };

  reportZoom = () => {
    const periods = [
      'years',
      'months',
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
    ];
    const momentDuration = moment.duration(
      this.state.durationMsPerPixel * MAX_TICK_SPACING_PX
    );
    const zoomedPeriod = find(
      periods,
      period => Math.floor(momentDuration.get(period)) && period
    );
    this.props.onTimelineZoom(zoomedPeriod);
  };

  render() {
    const timeScale = getTimeScale(this.state);
    return (
      <TimeTravelContainer className="time-travel">
        <TimelineBar className="timeline">
          <TimelinePanButton
            icon="fa fa-chevron-left"
            movePixels={-this.state.timelineWidthPx / 4}
            onClick={this.handleTimelinePanButtonClick}
            timeScale={timeScale}
          />
          <Timeline
            inspectingInterval={this.props.hasRangeSelector}
            timestampNow={this.state.timestampNow}
            focusedTimestamp={this.state.focusedTimestamp}
            earliestTimestamp={this.props.earliestTimestamp}
            durationMsPerPixel={this.state.durationMsPerPixel}
            rangeMs={this.state.rangeMs}
            deployments={this.props.deployments}
            deploymentsLinkBuilder={this.props.deploymentsLinkBuilder}
            onDeploymentClick={this.props.onDeploymentClick}
            isLoading={this.props.isLoading}
            onJump={this.handleTimelineJump}
            onZoom={this.handleTimelineZoom}
            onPan={this.handleTimelinePan}
            onRelease={this.handleTimelineRelease}
            onResize={this.handleTimelineResize}
            onUpdateVisibleRange={this.props.onUpdateVisibleRange}
          />
          <TimelinePanButton
            icon="fa fa-chevron-right"
            movePixels={this.state.timelineWidthPx / 4}
            onClick={this.handleTimelinePanButtonClick}
            timeScale={timeScale}
          />
        </TimelineBar>
        <TimeControlsWrapper>
          <TimeControlsContainer>
            {this.props.hasLiveMode && (
              <LiveModeToggle
                showingLive={this.state.showingLive}
                onToggle={this.handleLiveModeToggle}
              />
            )}
            <TimestampInput
              timestamp={this.state.focusedTimestamp}
              onChangeTimestamp={this.handleInputChange}
              disabled={this.props.hasLiveMode && this.state.showingLive}
            />
            {this.props.hasRangeSelector && (
              <RangeSelector
                rangeMs={this.state.rangeMs}
                onChange={this.handleRangeChange}
              />
            )}
          </TimeControlsContainer>
        </TimeControlsWrapper>
      </TimeTravelContainer>
    );
  }
}

TimeTravel.propTypes = {
  /**
   * Optional list of deployment annotations shown in the timeline
   */
  deployments: PropTypes.array,
  /**
   * Optional function that builds links that deployment clicks should lead to
   */
  deploymentsLinkBuilder: PropTypes.func,
  /**
   * The earliest timestamp we can travel back in time to
   */
  earliestTimestamp: PropTypes.string,
  /**
   * Enables Time Travel to be in the live auto-update mode
   */
  hasLiveMode: PropTypes.bool,
  /**
   * Adds a range selector to the timestamp selector, for when the timestamp info is not enough
   */
  hasRangeSelector: PropTypes.bool,
  /**
   * Shows timeline loading indicator
   */
  isLoading: PropTypes.bool,
  /**
   * Optional callback handling the change of live mode
   */
  onChangeLiveMode: PropTypes.func,
  /**
   * Optional callback handling range in milliseconds change
   */
  onChangeRange: PropTypes.func,
  /**
   * Required callback handling every timestamp change
   */
  onChangeTimestamp: PropTypes.func.isRequired,
  /**
   * Optional hook for deployment annotation clicks
   */
  onDeploymentClick: PropTypes.func,
  /**
   * Optional callback handling clicks on timeline labels (e.g. for tracking)
   */
  onTimelineLabelClick: PropTypes.func,
  /**
   * Optional callback handling timeline panning (e.g. for tracking)
   */
  onTimelinePan: PropTypes.func,
  /**
   * Optional callback handling clicks on timeline pan buttons (e.g. for tracking)
   */
  onTimelinePanButtonClick: PropTypes.func,
  /**
   * Optional callback handling timeline zooming (e.g. for tracking)
   */
  onTimelineZoom: PropTypes.func,
  /**
   * Optional callback handling timestamp change by direct input box editing (e.g. for tracking)
   */
  onTimestampInputEdit: PropTypes.func,
  /**
   * Optional callback when visible part of the timeline gets updated
   */
  onUpdateVisibleRange: PropTypes.func,
  /**
   * Duration in milliseconds of the focused range (which ends at `timestamp`)
   */
  rangeMs: PropTypes.number,
  /**
   * The live mode shows current time and ignores the `timestamp` param
   */
  showingLive: PropTypes.bool,
  /**
   * The timestamp in focus
   */
  timestamp: PropTypes.string.isRequired,
};

TimeTravel.defaultProps = {
  deployments: [],
  deploymentsLinkBuilder: noop,
  earliestTimestamp: '2014-01-01T00:00:00Z',
  hasLiveMode: false,
  hasRangeSelector: false,
  isLoading: false,
  onChangeLiveMode: noop,
  onChangeRange: noop,
  onDeploymentClick: noop,
  onTimelineLabelClick: noop,
  onTimelinePan: noop,
  onTimelinePanButtonClick: noop,
  onTimelineZoom: noop,
  onTimestampInputEdit: noop,
  onUpdateVisibleRange: noop,
  // 1 hour as a default, only relevant if range selector is enabled
  rangeMs: 3600000,
  // only relevant if live mode is enabled
  showingLive: true,
};

export default TimeTravel;
