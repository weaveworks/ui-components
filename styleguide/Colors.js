import React from 'react';
import styled from 'styled-components';
import { map, pickBy, isString } from 'lodash';

import Text from '../src/components/Text';
import theme from '../src/theme';

const Row = styled.div`
  margin-bottom: 40px;
`;

const Sample = styled.div`
  display: inline-block;
  margin-right: 20px;
`;

const Swatch = styled.div`
  width: 110px;
  height: 110px;
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.color};
`;

const Label = styled.p`
  text-align: center;
  line-height: 1em;
`;

const curly = start => (start ? '{' : '}');

const swatches = collection => map(pickBy(collection, isString), (c, name) => (
  <Sample key={c}>
    <Swatch color={c} />
    <Label>{name}</Label>
  </Sample>
));

const Colors = () => (
  <div>
    <Row>
      <p>
        These colors can be accessed via the styled-components theme:
      </p>
    </Row>
    <Row>
      <pre>
        const MyButton = styled.button`
        <br />
        &nbsp; background: ${curly(true)}props =&gt; props.theme.colors.accent.blue{curly(false)};
        <br />
        `;
      </pre>
    </Row>
    <Text large>Primary Colors</Text>
    <Row>
      {swatches(theme.colors.primary)}
    </Row>
    <Text large>Accent Colors</Text>
    <Row>
      {swatches(theme.colors.accent)}
    </Row>
    <Text large>Status Colors</Text>
    <Row>
      {swatches(theme.colors.status)}
    </Row>
    <Text large>Neutral Colors</Text>
    <Row>
      {swatches(theme.colors.neutral)}
    </Row>
    <Text large>Legacy Colors</Text>
    <Row>
      {swatches(theme.colors)}
    </Row>
    <Text large>PromQL Colors</Text>
    <Row>
      {swatches(theme.colors.promQL)}
    </Row>
  </div>
);

export default Colors;
