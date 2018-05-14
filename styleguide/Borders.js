import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';

const Row = styled.div`
  margin-bottom: 40px;
`;

const Block = styled.span`
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const BorderElement = styled.div`
  border: 1px solid ${props => props.theme.colors.black};
  background-color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.normal};
  padding: 30px;
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
