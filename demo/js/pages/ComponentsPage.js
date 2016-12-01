import React from 'react';
import { Link } from 'react-router';
import { Grid, GridColumn } from '../../../src/components/Grid';

export default function ComponentsPage({children}) {
  return (
    <div className="components-page">
      <Grid>
        <GridColumn span={2}>
          <div className="nav">
            <h4><Link to="/components">Weave UI Components</Link></h4>
            <Link to="/components/button">Button</Link>
            <Link to="/components/grid">Grid</Link>
            <Link to="/components/menu">Menu</Link>
          </div>
        </GridColumn>
        <GridColumn span={10}>
          <div className="component-example-page">
            {children}
          </div>
        </GridColumn>
      </Grid>
    </div>
  );
}
