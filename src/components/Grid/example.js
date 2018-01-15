import React from 'react';
import times from 'lodash/times';

import { Example, Info } from '../../utils/example';
import { Grid, GridColumn, GridRow as Row } from '.';

export default function GridExample() {
  const twelve = [];
  for (let i = 0; i < 12; i += 1) {
    twelve.push(
      <GridColumn key={i} span={1}>
        <div style={{backgroundColor: '#3c3c5b', height: '200px', width: '100%'}} />
      </GridColumn>
    );
  }
  return (
    <div>
      <Example>
        <Grid>
          <Row>
            <GridColumn span={4}>
              <p>First Col (span 4)</p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            anim id est laborum.
          </GridColumn>
            <GridColumn span={8}>
              <p>Second Col (span 8)</p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            anim id est laborum.
          </GridColumn>
          </Row>
        </Grid>
      </Example>
      <Example>
        <Info>A grid with three columns (span 4)</Info>
        <Grid>
          <Row>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
          </Row>
        </Grid>
      </Example>
      <Example>
        <Info>A grid with 12 columns (span 1)</Info>
        <Grid>
          <Row>
            {twelve}
          </Row>
        </Grid>
      </Example>
      <Example>
        <Info>Using a Row with alignContent</Info>
        <Grid>
          <Row alignContent="center">
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
          </Row>
          <Row alignContent="left">
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
          </Row>
          <Row alignContent="right">
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
            <GridColumn span={4}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
          </Row>
        </Grid>
      </Example>
      <Example>
        <Info>Use columns without a {'<Row />'} element to get items to wrap nicely</Info>
        <Grid>
          {
          times(20, i => (
            <GridColumn key={i} span={1}>
              <div style={{backgroundColor: '#8383ac', height: '200px', width: '100%'}} />
            </GridColumn>
          ))
        }
        </Grid>
      </Example>
    </div>
  );
}
