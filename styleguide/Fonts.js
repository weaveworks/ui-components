import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';

const Row = styled.div`
  margin-bottom: 40px;
`;

const FontRow = styled.div`
  margin-bottom: 5px;
`;

const curly = start => (start ? '{' : '}');

class Fonts extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <p>These fonts can be accessed via the styled-components theme:</p>
        </Row>
        <Row>
          <pre>
            const MyButton = styled.button`
            <br />
            &nbsp; font-size: ${curly(true)}props =&gt;
            props.theme.fontSizes.large{curly(false)};
            <br />
            `;
          </pre>
        </Row>
        {map(theme.fontSizes, (value, name) => (
          <FontRow key={name}>
            <Text {...{[name]: true}}>
              theme.fontSizes.{name} ({value})
            </Text>
          </FontRow>
        ))}
      </div>
    );
  }
}

export default Fonts;
