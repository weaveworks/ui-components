import React from 'react';
import { Link } from 'react-router';

import { isActivePage } from './utils';

import Logo from '../../src/components/WeaveWorksLogo';
import { Menu, MenuItem } from '../../src/components/Menu';
import { Grid, GridColumn, GridRow as Row } from '../../src/components/Grid';

export default function LandingPage({children}) {
  return (
    <div className="app">
      <div className="header">
        <Grid>
          <Row>
            <GridColumn span={2}>
              <Link to="/">
                <Logo />
              </Link>
            </GridColumn>
            <GridColumn span={8}>
              <Menu>
                <Link to="/components">
                  <MenuItem text="Components" active={isActivePage('components')} />
                </Link>
                <Link to="/styleguide">
                  <MenuItem text="Style Guide" active={isActivePage('styleguide')} />
                </Link>
              </Menu>
            </GridColumn>
          </Row>
        </Grid>
      </div>
      {children}
    </div>
  );
}
