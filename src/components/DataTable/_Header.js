import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledHeader = component => styled(component)`
  text-align: left;
  cursor: ${props => (props.sortable ? 'pointer' : 'inherit')};
  user-select: none;
  width: ${props => props.width};

  &:hover {
    color: ${props =>
      props.sortable ? props.theme.colors.blue700 : 'inherit'};
  }
`;

class Header extends React.Component {
  handleClick = ev => {
    const { onClick, value, sortable } = this.props;

    if (onClick && sortable) {
      onClick(ev, value);
    }
  };

  render() {
    const { className, children, order, sortable, title } = this.props;

    return (
      <td onClick={this.handleClick} className={className} title={title}>
        {children}{' '}
        {order && sortable && (
          <i
            className={order === 'desc' ? 'fa fa-caret-down' : 'fa fa-caret-up'}
          />
        )}
      </td>
    );
  }
}

// Only way to declare default props :(
const Styled = StyledHeader(Header);

Styled.propTypes = {
  /**
   * Sort order. Should be either `asc` or `desc`
   */
  order: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Whether or not the column will be sortable
   */
  sortable: PropTypes.bool,
  /**
   * The width that will be applied to the column
   */
  width: PropTypes.string,
};

Styled.defaultProps = {
  sortable: true,
};

export default Styled;
