import React from 'react';
import { Link } from 'react-router';
import { Grid, GridColumn } from '../../../src/components/Grid';
import { Menu, MenuItem } from '../../../src/components/Menu';


export default class ComponentsPage extends React.Component {
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
        <Grid>
          <GridColumn span={2}>
            <div className="nav">
              <h4><Link to="/components">Weave UI Components</Link></h4>
              <Menu>
                <MenuItem onClick={this.navigate} text="Button" />
                <MenuItem onClick={this.navigate} text="Grid" />
                <MenuItem onClick={this.navigate} text="Menu" />
              </Menu>
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
