import React from 'react';
import { capitalize } from 'lodash';

import { isActivePage } from './utils';

import { Menu, MenuItem } from '../../src/components/Menu';
import {Grid, GridColumn } from '../../src/components/Grid';

class StyleGuidePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.navigate = this.navigate.bind(this);
  }

  navigate(menuItem) {
    this.context.router.push(`/styleguide/${menuItem.toLowerCase()}`);
  }

  render() {
    const items = this.context.styles.keys().map((page) => {
      const pageName = page.split('/').pop().replace('.md', '');
      return (
        <MenuItem
          active={isActivePage(pageName)}
          key={page}
          onClick={this.navigate}
          text={capitalize(pageName)}
        />
      );
    });
    return (
      <div className="styleguide-page">
        <Grid>
          <GridColumn span={2}>
            <div className="content-section">
              <div className="nav">
                <Menu>
                  {items}
                </Menu>
              </div>
            </div>
          </GridColumn>
          <GridColumn span={10}>
            <div className="style-guide-page-body markdown-body">{this.props.children}</div>
          </GridColumn>
        </Grid>
      </div>
    );
  }
}

StyleGuidePage.contextTypes = {
  router: React.PropTypes.object.isRequired,
  styles: React.PropTypes.func.isRequired
};

export default StyleGuidePage;
