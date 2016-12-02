import React from 'react';
import _ from 'lodash';

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
    // Renders a tree structure for the left-hand navigation links.
    // Filters out .js resources to avoid duplicates.
    // => { Grid: {name: 'Grid', subModules: ['GridColumn']}, Button: {...}, ...}
    const links = components.keys().filter(n => !_.includes(n, '.js'));
    const tree = _.reduce(links, (result, resource) => {
      const [dir, module] = resource.split('/').filter(n => n !== '.');
      const isDefault = dir === module;
      // Determine the link matches the top level dir. Else, creates an array of subModules.
      if (isDefault && !result[dir]) {
        result[dir] = { name: module };
      } else if (!isDefault && result[dir]) {
        if (!result[dir].subModules) {
          result[dir].subModules = [module];
        } else {
          result[dir].subModules.push(module);
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
                  {_.map(tree, ({name, subModules}) => {
                    const children = _.map(subModules, m => (
                      <MenuItem key={m} onClick={this.navigate} text={m} />
                    ));
                    return (
                      <MenuItem key={name} onClick={this.navigate} text={name}>
                        {children.length > 0 && <div className="sub-modules">{children}</div>}
                      </MenuItem>
                    );
                  })}
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
