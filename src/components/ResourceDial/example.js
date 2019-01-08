import React from 'react';
import styled from 'styled-components';

import { Example, Info } from '../../utils/example';

import ResourceDial from '.';

const InlineWrapper = styled.div`
  display: inline-block;
  margin: 20px;
`;

export default class ResourceDialExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      memoryUsage: Math.random(),
    };
  }

  componentDidMount() {
    this.updateUsages = setInterval(() => {
      this.setState({ memoryUsage: Math.random() });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.updateUsages);
  }

  render() {
    return (
      <div>
        <Example>
          <Info>Dynamic dial with a link</Info>
          <InlineWrapper>
            <ResourceDial
              label="Memory usage"
              value={this.state.memoryUsage}
              to={{ hash: '#memory-usage', pathname: window.location.pathname }}
            />
          </InlineWrapper>
        </Example>
        <Example>
          <Info>No value provided</Info>
          <InlineWrapper>
            <ResourceDial label="Disk usage" />
          </InlineWrapper>
        </Example>
        <Example>
          <Info>Spectrum of different values</Info>
          <InlineWrapper>
            <ResourceDial label="GPU Memory usage" value={0} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={0.0001} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={0.0011} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={0.0111} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={0.1111} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={0.99} />
          </InlineWrapper>
          <InlineWrapper>
            <ResourceDial label="CPU usage" value={1} />
          </InlineWrapper>
        </Example>
      </div>
    );
  }
}
