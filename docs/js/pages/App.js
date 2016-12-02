import React from 'react';

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
    // We only want links to top-level directories. For example, we should only have a link to
    // /Menu, insted of /Menu and /MenuItem. The filter cb will test to make sure the resrouce
    // being called is ./Menu/Menu.
    const links = components.keys().filter(resource =>
      resource.split('/').filter(n => n !== '.').every((el, i, ary) => el === ary[0])
    );
    return (
      <div className="components-page">
        <div className="header"><a href="http://weave.works"><Logo /></a></div>
        <Grid>
          <GridColumn span={2}>
            <div className="nav">
              <div className="content-section">
                <Menu>
                  {links.map(dir => (
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
