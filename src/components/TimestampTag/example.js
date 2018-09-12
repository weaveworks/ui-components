import React from 'react';
import moment from 'moment';

import { Info, Example } from '../../utils/example';

import TimestampTag from '.';

export default class TimestampTagExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minTimestamp: moment()
        .subtract(1, 'day')
        .unix(),
      maxTimestamp: moment().unix(),
      timestamp: moment().unix(),
    };
  }

  changeTimestamp = ev => {
    this.setState({
      timestamp: ev.target.value,
    });
  };

  render() {
    const { minTimestamp, maxTimestamp, timestamp } = this.state;
    const inputTimestamp = moment.unix(timestamp).format();

    return (
      <div>
        <Example>
          <input
            type="range"
            min={minTimestamp}
            max={maxTimestamp}
            value={timestamp}
            onChange={this.changeTimestamp}
          />
          <Info>Absolute timestamp</Info>
          <TimestampTag timestamp={inputTimestamp} />
          <Info>Absolute timestamp (compact)</Info>
          <TimestampTag compact timestamp={inputTimestamp} />
          <Info>Relative timestamp (default)</Info>
          <TimestampTag relative timestamp={inputTimestamp} />
          <Info>Relative timestamp (compact)</Info>
          <TimestampTag relative compact timestamp={inputTimestamp} />
        </Example>
      </div>
    );
  }
}
