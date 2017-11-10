import React from 'react';
import moment from 'moment';

import TimeTravel from '.';


export default class TimeTravelExample extends React.Component {
  constructor() {
    super();

    this.state = {
      timestamp: moment().format(),
    };

    this.handleChangeTimestamp = this.handleChangeTimestamp.bind(this);
  }

  handleChangeTimestamp(timestamp) {
    this.setState({ timestamp });
  }

  render() {
    return (
      <TimeTravel
        timestamp={this.state.timestamp}
        onChangeTimestamp={this.handleChangeTimestamp}
      />
    );
  }
}
