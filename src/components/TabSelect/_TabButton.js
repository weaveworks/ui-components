import React from 'react';
import styled from 'styled-components';
import { spacing } from '../../theme/selectors';

const TabName = styled.span``;

const getBgColor = (selected, secondary, theme) => {
  if (secondary) {
    return theme.colors.purple25;
  }

  return selected ? theme.colors.white : theme.colors.gray50;
};

const Styled = component => styled(component)`
  cursor: pointer;
  margin-bottom: -1px;
  margin-right: ${spacing('xxs')};
  padding-top: ${props => (props.small ? spacing('xs') : spacing('xs'))};
  padding-bottom: ${props => (props.small ? spacing('xs') : spacing('xs'))};
  padding-left: ${props => (props.small ? spacing('small') : spacing('base'))};
  padding-right: ${props => (props.small ? spacing('small') : spacing('base'))};
  font-size: ${props =>
    props.small ? props.theme.fontSizes.normal : props.theme.fontSizes.large};
  outline: 0;

  ${({ selected, secondary, theme }) => `
    background-color: ${getBgColor(selected, secondary, theme)};
    border-top-left-radius: ${theme.borderRadius.soft};
    border-top-right-radius: ${theme.borderRadius.soft};
    border: 1px solid ${theme.colors.purple100};
  `};

  ${props => props.selected && 'border-bottom: 1px solid transparent;'};

  ${TabName} {
    color: ${props => props.theme.colors.purple900};
    opacity: ${props => (props.selected ? 1 : 0.65)};
  }
`;

class TabButton extends React.Component {
  handeClick = ev => {
    this.props.onClick(ev, this.props.name);
  };

  render() {
    const { className, children } = this.props;
    return (
      <button onClick={this.handeClick} className={className}>
        <TabName>{children}</TabName>
      </button>
    );
  }
}

export default Styled(TabButton);
