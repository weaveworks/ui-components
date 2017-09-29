import React from 'react';
import styled from 'styled-components';
import { map } from 'lodash';

import Grid, { GridRow as Row, GridColumn as Column } from '../src/components/Grid';
import Text from '../src/components/Text';
import theme from '../src/theme';

const Swatch = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const Label = styled.p`
  text-align: center;
  line-height: 1em;
`;

const curly = start => (start ? '{' : '}');

const swatches = collection => map(collection, (c, name) => (
  <Column key={c}>
    <Swatch color={c} />
    <Label>{name}</Label>
  </Column>
));

const Colors = () => (
  <Grid>
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
  </Grid>
);

export default Colors;
