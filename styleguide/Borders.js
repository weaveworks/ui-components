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
  display: inline-block;
  margin-right: ${spacing('medium')};
  margin-bottom: ${spacing('medium')};
`;

const BorderElement = styled.div`
  border: 1px solid ${color('black')};
  background-color: ${color('white')};
  font-size: ${fontSize('normal')};
  padding: ${spacing('large')};
`;

const curly = start => (start ? '{' : '}');

class Borders extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Text extraLarge>Border radius</Text>
        </Row>
        <Row>
          <pre>
            const MyButton = styled.button`
            <br />
            &nbsp; border-radius: ${curly(true)}props =&gt;
            props.theme.borderRadius.soft{curly(false)};
            <br />
            `;
          </pre>
        </Row>
        <Row>
          {map(theme.borderRadius, (value, name) => (
            <Block key={name}>
              <BorderElement style={{ borderRadius: value }}>
                theme.borderRadius.<b>{name}</b>
              </BorderElement>
            </Block>
          ))}
        </Row>
      </div>
    );
  }
}

export default Borders;
