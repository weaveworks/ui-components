import React from 'react';

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
      <br />
      <p><b>A grid with three columns (span 4)</b></p>
      <br />
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
      <br />
      <p><b>A grid with 12 columns (span 1)</b></p>
      <br />
      <Grid>
        <Row>
          {twelve}
        </Row>

      </Grid>
      <p><b>Using a Row with alignContent</b></p>
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
    </div>

  );
}
