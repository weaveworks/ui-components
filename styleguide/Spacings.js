import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';
import { color, fontSize, spacing } from '../src/theme/selectors';

const Row = styled.div`
  margin-bottom: ${spacing('large')};
`;

const Block = styled.div`
  display: block;
  margin-right: ${spacing('base')};
  margin-bottom: ${spacing('medium')};
`;

const SpacingElement = styled.div`
  background-color: ${color('blue400')};
`;

const SizeLabel = styled.div`
  color: ${color('gray600')};
  font-size: ${fontSize('normal')};
  margin-top: ${spacing('xs')};
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
