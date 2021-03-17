import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COMPACT_LOCALE_KEY } from '../../utils/format';

const Timestamp = styled.span`
  ${props =>
    !props.inheritStyles &&
    `
    color: ${props.theme.colors.gray600};
    font-size: ${props.theme.fontSizes.small};
  `};
`;

/**
 * TimestampTag renders an auto-update timestamp in a consistent format.
 * ```javascript
 * import { TimestampTag } from 'weaveworks-ui-components';
 *
 * export default function TimestampTag() {
 *   return (
 *     <div>
 *       <Info>Absolute timestamp</Info>
 *       <TimestampTag timestamp={timestamp} />
 *
 *       <Info>Relative timestamp (default)</Info>
 *       <TimestampTag relative timestamp={timestamp} />
 *
 *       <Info>Relative timestamp (compact)</Info>
 *       <TimestampTag relative compact timestamp={timestamp} />
 *     </div>
 *   );
 * }
 * ```
 */
class TimestampTag extends React.Component {
  componentDidMount() {
    if (this.props.relative) {
      this.startAutoRefresh(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.relative) {
      this.startAutoRefresh(nextProps);
    } else {
      this.stopAutoRefresh();
    }
  }

  componentWillUnmount() {
    this.stopAutoRefresh();
  }

  startAutoRefresh = ({ intervalMs }) => {
    this.stopAutoRefresh();
    this.timer = setInterval(() => {
      this.forceUpdate();
    }, intervalMs);
  };

  stopAutoRefresh = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  render() {
    const { relative, compact, timestamp, inheritStyles } = this.props;
    const relativeLocale = compact ? COMPACT_LOCALE_KEY : moment.locale();
    const momentTimestamp = moment(timestamp).utc();

    return (
      <Timestamp
        inheritStyles={inheritStyles}
        title={
          relative
            ? momentTimestamp.format('dddd, MMMM Do YYYY, HH:mm:ss [UTC]')
            : momentTimestamp.fromNow()
        }
      >
        {relative
          ? momentTimestamp.locale(relativeLocale).fromNow(compact)
          : momentTimestamp
              .startOf('second')
              .format(compact ? 'YYYY-MM-DD' : '')}
      </Timestamp>
    );
  }
}

TimestampTag.propTypes = {
  /**
   * Show in compact format if true (only for relative timestamps)
   */
  compact: PropTypes.bool,
  /**
   * Inherit the styles from parent element if true
   */
  inheritStyles: PropTypes.bool,
  /**
   * Auto-refresh interval (in milliseconds)
   */
  intervalMs: PropTypes.number,
  /**
   * Show relative timestamp if true
   */
  relative: PropTypes.bool,
  /**
   * Timestamp to be displayed
   */
  timestamp: PropTypes.string.isRequired,
};

TimestampTag.defaultProps = {
  compact: false,
  inheritStyles: false,
  intervalMs: 15000,
  relative: false,
};

export default TimestampTag;
