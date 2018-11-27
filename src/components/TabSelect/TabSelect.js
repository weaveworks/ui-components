import React from 'react';
import styled from 'styled-components';
import { pick, map, find, get } from 'lodash';
import PropTypes from 'prop-types';
import { spacing } from '../../theme/selectors';

import Tab from './Tab';
import TabButton from './_TabButton';

const TabButtons = styled.div``;

const borders = props => `
    border-top-right-radius: ${props.theme.borderRadius.soft};
    border-bottom-right-radius: ${props.theme.borderRadius.soft};
    border-bottom-left-radius: ${props.theme.borderRadius.soft};
    border: 1px solid ${props.theme.colors.purple100};
`;

const bordersOnlyTop = props => `
  border-top: 1px solid ${props.theme.colors.purple100}
`;

const TabContent = styled.div`
  padding: ${props =>
    props.small ? props.theme.spacing.small : props.theme.spacing.medium};
  background-color: ${props =>
    props.secondary ? 'transparent' : props.theme.colors.white};

  ${props => (props.secondary ? bordersOnlyTop(props) : borders(props))};
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
    const { className, children, secondary, small } = this.props;
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
              secondary={secondary}
              small={small}
              onClick={this.handleTabClick}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
        <TabContent small={small} secondary={secondary}>
          {selected}
        </TabContent>
      </div>
    );
  }
}

TabSelect.propTypes = {
  /**
   * Secondary styling for TabSelect without border around content and
   * transparent background
   */
  secondary: PropTypes.bool,
  /**
   * Small styling for TabSelect
   */
  small: PropTypes.bool,
  /**
   * The tab to show on first render.
   * Supplying a new value to this prop will override the currently selected item
   */
  selectedTab: PropTypes.string,
  /**
   * Children of `TabSelect` must be a `Tab` component
   */
  // eslint can't figure out that this is required because of custom checker
  // function and so requires a defaultProp be set
  // eslint-disable-next-line react/require-default-props
  children: (props, propName) => {
    let error = null;
    if (React.Children.count === 0) {
      return new Error('You cannot have a TabSelect without any Tabs');
    }

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

TabSelect.defaultProps = {
  secondary: false,
  small: false,
  selectedTab: '',
};

export default Styled(TabSelect);
