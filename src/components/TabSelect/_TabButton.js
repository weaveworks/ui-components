import React from 'react';
import styled from 'styled-components';

const TabName = styled.span``;

const getBgColor = (selected, secondary, theme) => {
  if (secondary) {
    return theme.colors.sand;
  }

  return selected ? theme.colors.white : theme.colors.lightgray;
};

const Styled = component => styled(component)`
  cursor: pointer;
  margin-bottom: -1px;
  margin-right: 5px;
  padding: 10px 20px;
  font-size: ${props => props.theme.fontSizes.large};
  outline: 0;

  ${({ selected, secondary, theme }) => `
    background-color: ${getBgColor(selected, secondary, theme)};
    border-top-left-radius: ${theme.borderRadius.soft};
    border-top-right-radius: ${theme.borderRadius.soft};
    border: 1px solid ${theme.colors.athens};
  `};

  ${props => props.selected && 'border-bottom: 1px solid transparent;'};

  ${TabName} {
    color: ${props => props.theme.colors.primary.charcoal};
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
