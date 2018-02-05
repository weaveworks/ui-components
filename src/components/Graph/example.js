import React from 'react';
import faker from 'faker';
import moment from 'moment';
import { range } from 'lodash';

import Graph from '.';
import { Example, Info } from '../../utils/example';

function generateRandomMultiSeries({ startTime, endTime, stepDuration }, count) {
  return range(count).map(() => ({
    metric: { namespace: faker.lorem.slug() },
    values: range(startTime, endTime, stepDuration).map(time => (
      [time, faker.random.number({ min: 10, max: 20 })]
    )),
  }));
}

function getSeriesName({ metrics }) {
  return JSON.stringify(metrics);
}

export default class GraphExample extends React.Component {
  constructor() {
    super();

    this.state = {
      startTime: moment('2018-02-05T11:24:14Z').unix(),
      endTime: moment('2018-02-05T11:54:14Z').unix(),
      stepDuration: 9,
    };

    this.state.multiSeries = generateRandomMultiSeries(this.state, 7);
  }

  render() {
    return (
      <div>
        <Example>
          <Info>Simple graph</Info>
          <Graph
            showStacked
            multiSeries={this.state.multiSeries}
            stepDurationSec={this.state.stepDuration}
            startTimeSec={this.state.startTime}
            endTimeSec={this.state.endTime}
            getSeriesName={getSeriesName}
          />
        </Example>
      </div>
    );
  }
}
