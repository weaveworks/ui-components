import React from 'react';
import styled from 'styled-components';

const StyledHeader = component => styled(component)`
  text-align: left;
  cursor: ${props => (props.sortable ? 'pointer' : 'inherit')};
  user-select: none;

  &:hover {
    color: ${props => (props.sortable ? props.theme.colors.turquoise : 'inherit')};
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
    const { className, children, order } = this.props;

    return (
      <td onClick={this.handleClick} className={className}>
        {children}{' '}
        {order && <i className={order === 'asc' ? 'fa fa-caret-up' : 'fa fa-caret-down'} />}
      </td>
    );
  }
}

// Only way to declare default props :(
const Styled = StyledHeader(Header);

Styled.defaultProps = {
  sortable: true,
};

export default Styled;
