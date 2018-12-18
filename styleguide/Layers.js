import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';
import { spacing } from '../src/theme/selectors';

const Row = styled.div`
  margin-bottom: ${spacing('large')};
`;

const FontRow = styled.div`
  margin-bottom: ${spacing('xxs')};
`;

const curly = start => (start ? '{' : '}');

class Layers extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Text extraLarge>
            Layers <i>(z-index)</i>
          </Text>
        </Row>
        <Row>
          <pre>
            const MyButton = styled.button`
            <br />
            &nbsp; z-index: ${curly(true)}props =&gt; props.theme.layers.tooltip
            {curly(false)};
            <br />
            `;
          </pre>
        </Row>
        {map(theme.layers, (value, name) => (
          <FontRow key={name}>
            <b>{value}</b> - {name}
          </FontRow>
        ))}
      </div>
    );
  }
}

export default Layers;
