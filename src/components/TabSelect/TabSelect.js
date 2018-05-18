import React from 'react';
import styled from 'styled-components';
import { pick, map, find, get } from 'lodash';
import PropTypes from 'prop-types';

import Tab from './Tab';
import TabButton from './_TabButton';

const TabButtons = styled.div``;

const TabContent = styled.div`
  padding: 20px;
  background-color: ${props => props.theme.colors.white};

  ${props => `
    border-top-right-radius: ${props.theme.borderRadius.soft};
    border-bottom-right-radius: ${props.theme.borderRadius.soft};
    border-bottom-left-radius: ${props.theme.borderRadius.soft};
    border: 1px solid ${props.theme.colors.athens};
  `};
`;

const Styled = component => styled(component)``;

class TabSelect extends React.PureComponent {
  state = {
    selectedTab:
      // Use the first tab as the default if no selectedTab prop is specified.
      this.props.selectedTab || get(this.props.children, '[0].props.name'),
  };

  componentWillReceiveProps(nextProps) {
    // Always override user-selected tab with the default one from
    // the prop input (so that URL param can take precedence).
    if (nextProps.selectedTab !== this.props.selectedTab) {
      this.setState({ selectedTab: nextProps.selectedTab });
    }
  }

  isSelectedTab = ({ name }) => name === this.state.selectedTab;

  handleTabClick = (ev, tabName) => {
    this.setState({ selectedTab: tabName });

    if (this.props.onChange) {
      this.props.onChange(ev, tabName);
    }
  };

  render() {
    const { className, children } = this.props;
    const tabs = React.Children.map(children, child =>
      pick(child.props, ['label', 'name'])
    );

    const selected = find(children, c => this.isSelectedTab(c.props));

    return (
      <div className={className}>
        <TabButtons>
          {map(tabs, tab => (
            <TabButton
              key={tab.name}
              name={tab.name}
              selected={this.isSelectedTab(tab)}
              onClick={this.handleTabClick}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
        <TabContent>{selected}</TabContent>
      </div>
    );
  }
}

TabSelect.propTypes = {
  /**
   * The tab to show on first render.
   * Supplying a new value to this prop will override the currently selected item
   */
  selectedTab: PropTypes.string,
  /**
   * Children of `TabSelect` must be a `Tab` component
   */
  children: (props, propName) => {
    let error = null;
    React.Children.forEach(props[propName], child => {
      if (child.type !== Tab) {
        error = new Error(
          `Wrong component supplied to TabSelect. Expected a <Tab />, got a ${
            child.type
          }`
        );
      }
    });
    return error;
  },
};

export default Styled(TabSelect);
