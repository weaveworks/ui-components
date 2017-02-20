import React from 'react';
import _ from 'lodash';

import { isActivePage } from './utils';

import { Grid, GridColumn as Column, GridRow as Row } from '../../src/components/Grid';
import { Menu, MenuItem } from '../../src/components/Menu';

class ComponentsPage extends React.Component {
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
    // => { Grid: {name: 'Grid', subModules: ['Column']}, Button: {...}, ...}
    const links = this.context.components.keys().filter(n => !_.includes(n, '.js'));
    const tree = _.reduce(links, (result, resource) => {
      const [dir, module] = resource.split('/').filter(n => n !== '.');
      const isDefault = dir === module;
      const item = (
        <MenuItem
          active={isActivePage(module.toLowerCase())}
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
        <Grid>
          <Row>
            <Column span={2}>
              <div className="nav">
                <div className="content-section">
                  <Menu>
                    {_(tree).map(t => [t.component, t.subModules]).flatten().value()}
                  </Menu>
                </div>
              </div>
            </Column>
            <Column span={10}>
              <div className="component-example-page">
                {this.props.children}
              </div>
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
}

// Pass components in as context to give `ComponentsPage` access to them for rendering.
// This is to avoid having to wire up redux or having a top-level state.
ComponentsPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
  components: React.PropTypes.func.isRequired
};

export default ComponentsPage;
