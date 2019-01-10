import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import { noop } from 'lodash';

import { spacing } from '../../theme/selectors';

const Item = styled.div`
  border-radius: ${props => props.theme.borderRadius.soft};
  display: block;
  min-height: 40px;
  line-height: 40px;
  padding-left: ${spacing('medium')};

  &:hover {
    transition: color, 0.3s, ease;
    color: ${props => !props.active && props.theme.colors.purple800};
    background-color: ${props => !props.active && props.theme.colors.gray50};
    cursor: pointer;
  }

  ${props =>
    props.isSubItem &&
    `
    font-size: 14px;
    padding-left: ${props.theme.spacing.xl};
    line-height: 30px;
    min-height: 30px;
  `};

  ${props =>
    props.active &&
    `
    color: ${props.theme.colors.gray50};
    background-color: ${props.theme.colors.purple400};
  `};
`;

/**
 * A child of the `<Menu />` component.
 *
 * See also [Menu](/components/menu)
 */
class MenuItem extends React.Component {
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.text);
    }
  };

  render() {
    const { text, children, className, active, isSubItem } = this.props;
    // Use the className the users gives, or fall back to 'weave-menu-item'.
    const cl = classnames(className || 'weave-menu-item', {
      'menu-item-active': active,
    });
    return (
      <Item
        onClick={this.handleClick}
        className={cl}
        active={active}
        isSubItem={isSubItem}
      >
        <div className="menu-text">{text}</div>
        {children}
      </Item>
    );
  }
}

MenuItem.propTypes = {
  /**
   * Renders small text if true.
   */
  isSubItem: PropTypes.bool,
  /**
   * Handler that will be run on click. The `text` prop is passed to the handler function.
   */
  onClick: PropTypes.func,
  /**
   * Text that will be displayed as the menu item.
   */
  text: PropTypes.string,
};

MenuItem.defaultProps = {
  isSubItem: false,
  onClick: noop,
  text: '',
};

export default MenuItem;
