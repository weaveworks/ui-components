import React from 'react';
import _ from 'lodash';

import { Grid, GridColumn } from '../../src/components/Grid';
import { Menu, MenuItem } from '../../src/components/Menu';
import Logo from '../../src/components/WeaveWorksLogo';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.navigate = this.navigate.bind(this);
  }

  navigate(menuItem) {
    this.context.router.push(`/components/${menuItem.toLowerCase()}`);
  }

  render() {
    // Renders a tree structure for the left-hand navigation links.
    // Filters out .js resources to avoid duplicates.
    // => { Grid: {name: 'Grid', subModules: ['GridColumn']}, Button: {...}, ...}
    const links = this.context.components.keys().filter(n => !_.includes(n, '.js'));
    const tree = _.reduce(links, (result, resource) => {
      const [dir, module] = resource.split('/').filter(n => n !== '.');
      const isDefault = dir === module;
      const item = (
        <MenuItem
          key={module}
          className={isDefault ? 'weave-menu-item' : 'weave-menu-sub-item'}
          onClick={this.navigate}
          text={module}
        />
      );
      // Determine the link matches the top level dir. Else, creates an array of subModules.
      if (isDefault && !result[dir]) {
        result[dir] = { component: item };
      } else if (!isDefault && result[dir]) {
        if (!result[dir].subModules) {
          result[dir].subModules = [item];
        } else {
          result[dir].subModules.push(item);
        }
      }
      return result;
    }, {});

    return (
      <div className="components-page">
        <div className="header"><a href="http://weave.works"><Logo /></a></div>
        <Grid>
          <GridColumn span={2}>
            <div className="nav">
              <div className="content-section">
                <Menu>
                  {_(tree).map(t => [t.component, t.subModules]).flatten().value()}
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

// Pass components in as context to give `App` access to them for rendering.
// This is to avoid having to wire up redux or having a top-level state.
App.contextTypes = {
  router: React.PropTypes.object.isRequired,
  components: React.PropTypes.func.isRequired
};

export default App;