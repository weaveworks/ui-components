import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { map, find, filter, includes, lowerCase } from 'lodash';

import Input from '../Input';

const WIDTH = '256px';
const HEIGHT = '36px';

const Item = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 24px;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.neutral.lightgray};
  border-radius: ${props => props.theme.borderRadius};
  z-index: 4;
  box-shadow: ${props => props.theme.boxShadow.light};
  margin-top: 4px;
  width: ${WIDTH};
  box-sizing: border-box;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
`;

const ItemWrapper = Item.extend`
  line-height: ${HEIGHT};
  color: ${props =>
    props.selected ? props.theme.colors.accent.blue : props.theme.textColor};
  min-height: ${HEIGHT};

  &:hover {
    background-color: #eee;
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius} 0 0;
  }

  &:last-child {
    border-bottom: 0;
    border-radius: 0 0 ${props => props.theme.borderRadius};
  }
`;

const SelectedItem = Item.extend`
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.colors.neutral.white};
  border: 1px solid ${props => props.theme.colors.neutral.gray};
  display: flex;
  position: relative;
  z-index: 3;

  ${Item} {
    padding: 0;
  }

  div:last-child {
    margin: auto 0 auto auto;
  }

  ${Input} {
    padding: 0;
    & i,
    span {
      display: none;
    }

    input {
      box-sizing: border-box;
      width: 100%;
    }
  }
`;

const SelectedItemIcon = styled.span`
  padding-left: 1em;
`;

const OtherOptions = styled.div`
  border-top: 1px solid ${props => props.theme.colors.neutral.gray};
`;

const StyledDropdown = component => styled(component)`
  height: ${HEIGHT};
  line-height: ${HEIGHT};
  position: relative;
  width: ${WIDTH};
`;

/**
 * A selectable drop-down menu.
 * ```javascript
 *const items = [
 *  {
 *    value: 'first-thing',
 *    label: 'First Thing',
 *  },
 *  {
 *    value: 'second-thing',
 *    label: 'Second Thing',
 *  },
 *  {
 *    value: 'third-thing',
 *    label: 'Super long thing, this get truncated',
 *  },
 * ];
 *
 * <Dropdown items={items} />
 * ```
 */

class Dropdown extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
      query: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBgClick = this.handleBgClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(ev, value) {
    this.setState({ isOpen: false });
    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  }

  handleClick() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen, query: '' }));
  }

  handleBgClick() {
    this.setState({ isOpen: false });
  }

  handleSearch(ev) {
    this.setState({ query: ev.target.value });
  }

  render() {
    const { items, value, className, otherOptions, searchable } = this.props;
    const { isOpen, query } = this.state;
    const currentItem =
      find(items, i => i.value === value) || (items && items[0]);

    const itemsToDisplay =
      searchable && query
        ? filter(items, i => includes(lowerCase(i.label), lowerCase(query)))
        : items;

    return (
      <div className={className}>
        <SelectedItem onClick={this.handleClick}>
          {searchable && isOpen ? (
            <Input
              focus
              onChange={this.handleSearch}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <Item title={currentItem.label}>
              {currentItem && currentItem.label}
            </Item>
          )}

          <div>
            <SelectedItemIcon
              className={searchable ? 'fa fa-search' : 'fa fa-caret-down'}
            />
          </div>
        </SelectedItem>
        {isOpen && (
          <div>
            <Popover>
              {map(itemsToDisplay, i => (
                <ItemWrapper
                  className="dropdown-item"
                  key={i.value}
                  onClick={ev => this.handleChange(ev, i.value)}
                  selected={i.value === value}
                  title={i.label}
                >
                  {i.label}
                </ItemWrapper>
              ))}
              {otherOptions &&
                otherOptions.length > 0 && (
                  <OtherOptions>
                    {map(otherOptions, o => (
                      <ItemWrapper
                        onClick={ev => this.handleChange(ev, o.value)}
                        key={o.value}
                        title={o.label}
                      >
                        {o.label}
                      </ItemWrapper>
                    ))}
                  </OtherOptions>
                )}
            </Popover>
            <Overlay onClick={this.handleBgClick} />
          </div>
        )}
      </div>
    );
  }
}

Dropdown.propTypes = {
  /**
   * Array of items that will be selectable. `value` should be an internal value,
   * `label` is what will be displayed to the user.
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  ).isRequired,
  /**
   * The value of the currently selected item. This much match a value in the `items` prop.
   * If no value is provided, the first elements's value will be used.
   */
  value: PropTypes.string,
  /**
   * A handler function that will run when a value is selected.
   */
  onChange: PropTypes.func,
  /**
   * A list of other options that will appear at the bottom of the list.
   * Should have the same `value` and `label` fields that the `items` prop has.
   */
  otherOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  )
};

export default StyledDropdown(Dropdown);
