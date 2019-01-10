import React from 'react';
import faker from 'faker';
import moment from 'moment';
import { compact, times } from 'lodash';

import Text from '../Text';
import { Example, Info } from '../../utils/example';

import TimeTravel from '.';

function generateDeployments({ startTime, endTime }, count) {
  return times(count, () => ({
    Data: compact([
      `Commit: ${faker.lorem.word()}`,
      Math.random() < 0.5 && faker.lorem.slug(),
      Math.random() < 0.5 && faker.lorem.slug(),
      Math.random() < 0.5 && faker.lorem.slug(),
    ]).join(', '),
    Stamp: moment.unix(faker.random.number({ max: endTime, min: startTime })),
  }));
}

export default class TimeTravelExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deployments: generateDeployments(
        {
          endTime: moment().unix(),
          startTime: moment()
            .subtract(1, 'month')
            .unix(),
        },
        500
      ),
      isLoading2: false,
      rangeMs3: 3600000,
      showingLive3: true,
      timestamp1: moment()
        .utc()
        .format(),
      timestamp2: moment()
        .utc()
        .format(),
      timestamp3: moment()
        .utc()
        .format(),
      visibleEndAt: null,
      visibleStartAt: null,
    };
  }

  handleChangeTimestamp1 = timestamp1 => {
    this.setState({ timestamp1 });
  };

  handleChangeTimestamp2 = timestamp2 => {
    this.setState({ isLoading2: true, timestamp2 });
    // Show loading indicator for 5 seconds after every timestamp change..
    setTimeout(() => {
      this.setState({ isLoading2: false });
    }, 5000);
  };

  handleChangeTimestamp3 = timestamp3 => {
    this.setState({ timestamp3 });
  };

  handleChangeLiveMode3 = showingLive3 => {
    this.setState({ showingLive3 });
  };

  handleChangeRange3 = rangeMs3 => {
    this.setState({ rangeMs3 });
  };

  handleUpdateVisibleRange = ({ startAt, endAt }) => {
    this.setState({
      visibleEndAt: endAt,
      visibleStartAt: startAt,
    });
  };

  render() {
    return (
      <div>
        <Example>
          <Info>Simple timestamp selector</Info>
          <TimeTravel
            timestamp={this.state.timestamp1}
            onChangeTimestamp={this.handleChangeTimestamp1}
            onUpdateVisibleRange={this.handleUpdateVisibleRange}
          />
        </Example>
        <Example>
          <Info>With deployments</Info>
          <TimeTravel
            isLoading={this.state.isLoading2}
            timestamp={this.state.timestamp2}
            onChangeTimestamp={this.handleChangeTimestamp2}
            onUpdateVisibleRange={this.handleUpdateVisibleRange}
            deployments={this.state.deployments}
          />
        </Example>
        <Example>
          <Info>Range selector with live mode support</Info>
          <TimeTravel
            timestamp={this.state.timestamp3}
            onChangeTimestamp={this.handleChangeTimestamp3}
            hasLiveMode
            showingLive={this.state.showingLive3}
            onChangeLiveMode={this.handleChangeLiveMode3}
            hasRangeSelector
            rangeMs={this.state.rangeMs3}
            onChangeRange={this.handleChangeRange3}
            onUpdateVisibleRange={this.handleUpdateVisibleRange}
          />
        </Example>
        <hr />
        <Text small>
          Visible range: {this.state.visibleStartAt} - {this.state.visibleEndAt}
        </Text>
      </div>
    );
  }
}
