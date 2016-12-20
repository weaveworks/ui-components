import React from 'react';
import { Link } from 'react-router';

import Logo from '../../src/components/WeaveWorksLogo';
import { Menu, MenuItem } from '../../src/components/Menu';
import { Grid, GridColumn } from '../../src/components/Grid';

export default function LandingPage({children}) {
  return (
    <div className="app">
      <div className="header">
        <Grid>
          <GridColumn span={2}>
            <Link to="/">
              <Logo />
            </Link>
          </GridColumn>
          <GridColumn span={8}>
            <Menu>
              <Link to="/components">
                <MenuItem text="Components" />
              </Link>
              <MenuItem text="Style Guide" />
            </Menu>
          </GridColumn>
        </Grid>
      </div>
      {children}
    </div>
  );
}
