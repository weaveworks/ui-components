import React from 'react';
import includes from 'lodash/includes';

import { Grid, GridColumn } from '../../../src/components/Grid';
import { Menu, MenuItem } from '../../../src/components/Menu';
import Logo from '../../../src/components/Logo';

import components from '../components';


export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.navigate = this.navigate.bind(this);
  }

  navigate(menuItem) {
    this.props.router.push(`/components/${menuItem.toLowerCase()}`);
  }

  render() {
    const dirs = components.keys().filter(dir =>
      !includes(dir.split('/').pop(), '.js')
    );
    return (
      <div className="components-page">
        <div className="header"><a href="http://weave.works"><Logo /></a></div>
        <Grid>
          <GridColumn span={2}>
            <div className="nav">
              <div className="content-section">
                <Menu>
                  {dirs.map(dir => (
                    <MenuItem key={dir} onClick={this.navigate} text={dir.split('/').pop()} />
                  ))}
                </Menu>
              </div>
            </div>
          </GridColumn>
          <GridColumn span={10}>
            <div className="component-example-page">
              {this.props.children}
            </div>
          </GridColumn>
        </Grid>
      </div>
    );
  }
}
