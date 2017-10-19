import React from 'react';
import moment from 'moment';

import TimeTravel from '.';

export default class TimeTravelExample extends React.Component {
  constructor() {
    super();

    this.state = {
      timestamp: moment()
    };

    this.handleTimestampChange = this.handleTimestampChange.bind(this);
  }

  handleTimestampChange(timestamp) {
    this.setState({ timestamp });
  }

  render() {
    return (
      <TimeTravel
        timestamp={this.state.timestamp}
        onTimestampChange={this.handleTimestampChange}
      />
    );
  }
}
