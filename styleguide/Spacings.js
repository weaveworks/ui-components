import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';

const Row = styled.div`
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Block = styled.span`
  display: block;
  margin-right: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const SpacingElement = styled.div`
  background-color: ${props => props.theme.colors.blue400};
`;

const SizeLabel = styled.div`
  color: ${props => props.theme.colors.gray600};
  font-size: ${props => props.theme.fontSizes.normal};
  margin-top: ${props => props.theme.spacing.xs};
`;

const curly = start => (start ? '{' : '}');

class Spacings extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Text extraLarge>Spacing</Text>
        </Row>
        <Row>
          <pre>
            const MyButton = styled.button`
            <br />
            &nbsp; padding: ${curly(true)}props =&gt; props.theme.spacing.small
            {curly(false)};
            <br />
            `;
          </pre>
        </Row>
        <Row>
          {map(theme.spacing, (value, name) => (
            <Block key={name}>
              <SpacingElement style={{ width: value, height: value }} />
              <SizeLabel>{value}</SizeLabel>
              theme.spacing.<b>{name}</b>
            </Block>
          ))}
        </Row>
      </div>
    );
  }
}

export default Spacings;
