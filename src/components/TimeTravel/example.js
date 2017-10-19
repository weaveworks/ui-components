import React from 'react';
import moment from 'moment';

import TimeTravel from '.';

export default class TimeTravelExample extends React.Component {
  constructor() {
    super();

    this.state = {
      timestamp: moment(),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(timestamp) {
    this.setState({ timestamp });
  }

  render() {
    return (
      <TimeTravel
        timestamp={this.state.timestamp}
        onChange={this.handleChange}
      />
    );
  }
}
