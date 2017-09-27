import React from 'react';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { isActivePage } from './utils';

import { Menu, MenuItem } from '../../src/components/Menu';
import {Grid, GridColumn as Column, GridRow as Row } from '../../src/components/Grid';

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
      const pageName = page.split('/').pop().replace('.js', '');
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
          <Row>
            <Column span={2}>
              <div className="content-section">
                <div className="nav">
                  <Menu>
                    {items.sort(page => (page.props.text === 'Intro' ? -1 : 1))}
                  </Menu>
                </div>
              </div>
            </Column>
            <Column span={10}>
              <div className="style-guide-page-body markdown-body">{this.props.children}</div>
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
}

StyleGuidePage.contextTypes = {
  router: PropTypes.object.isRequired,
  styles: PropTypes.func.isRequired
};

export default StyleGuidePage;
