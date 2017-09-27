import React from 'react';
import styled from 'styled-components';

import Grid, { GridRow as Row, GridColumn as Column } from '../src/components/Grid';

const Swatch = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const main = [
  '#00d2ff',
  '#ff4b19',
  '#32324b',
  '#656597',
  '#7676b0',
];

export default function Colors() {
  return (
    <Grid>
      <Row>
        {
          main.map(c => (
            <Column key={c}>
              <Swatch color={c} />
            </Column>
          ))
        }
      </Row>
    </Grid>
  );
}
