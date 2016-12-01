import React from 'react';
import { Grid, GridColumn } from '../../../src/components/Grid';
import { Menu, MenuItem } from '../../../src/components/Menu';
import Logo from '../../../src/components/Logo';


export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.navigate = this.navigate.bind(this);
  }

  navigate(menuItem) {
    this.props.router.push(`/components/${menuItem.toLowerCase()}`);
  }

  render() {
    return (
      <div className="components-page">
        <div className="header"><a href="http://weave.works"><Logo /></a></div>
        <Grid>
          <GridColumn span={2}>
            <div className="nav">
              <div className="content-section">
                <Menu>
                  <MenuItem onClick={this.navigate} text="Logo" />
                  <MenuItem onClick={this.navigate} text="Button" />
                  <MenuItem onClick={this.navigate} text="Grid" />
                  <MenuItem onClick={this.navigate} text="Menu" />
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
