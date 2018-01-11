import React from 'react';
import moment from 'moment';

import TimeTravel from '.';
import { Example, Info } from '../../utils/example';


export default class TimeTravelExample extends React.Component {
  constructor() {
    super();

    this.state = {
      timestamp1: moment().format(),
      timestamp2: moment().format(),
      showingLive2: true,
      rangeMs2: 3600000,
    };

    this.handleChangeTimestamp1 = this.handleChangeTimestamp1.bind(this);
    this.handleChangeTimestamp2 = this.handleChangeTimestamp2.bind(this);
    this.handleChangeLiveMode2 = this.handleChangeLiveMode2.bind(this);
    this.handleChangeRange2 = this.handleChangeRange2.bind(this);
  }

  handleChangeTimestamp1(timestamp1) {
    this.setState({ timestamp1 });
  }

  handleChangeTimestamp2(timestamp2) {
    this.setState({ timestamp2 });
  }

  handleChangeLiveMode2(showingLive2) {
    this.setState({ showingLive2 });
  }

  handleChangeRange2(rangeMs2) {
    this.setState({ rangeMs2 });
  }

  render() {
    return (
      <div>
        <Example>
          <Info>Simple timestamp selector</Info>
          <TimeTravel
            timestamp={this.state.timestamp1}
            onChangeTimestamp={this.handleChangeTimestamp1}
          />
        </Example>
        <Example>
          <Info>Range selector with live mode support</Info>
          <TimeTravel
            timestamp={this.state.timestamp2}
            onChangeTimestamp={this.handleChangeTimestamp2}
            hasLiveMode
            showingLive={this.state.showingLive2}
            onChangeLiveMode={this.handleChangeLiveMode2}
            hasRangeSelector
            rangeMs={this.state.rangeMs2}
            onChangeRange={this.handleChangeRange2}
          />
        </Example>
      </div>
    );
  }
}
