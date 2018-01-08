import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { map, find, filter, includes, lowerCase } from 'lodash';

import Input from '../Input';
import Text from '../Text';

const WIDTH = '256px';
const HEIGHT = '36px';

const Item = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 24px;
  cursor: pointer;
`;

const Items = styled.div`
  max-height: 400px;
  overflow-y: auto;
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
  cursor: ${props => (props.unclickable ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${props => (props.unclickable ? 'inherit' : '#eee')};
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

    & > div {
      margin: 0 auto;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      line-height: 24px;
      padding: 0 12px;
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
  line-height: ${HEIGHT};
  position: relative;
  width: ${WIDTH};
`;

function filterItems(items, query) {
  if (!query) {
    return items;
  }

  const result = filter(items, i =>
    includes(lowerCase(i.label), lowerCase(query))
  );
  if (result.length === 0) {
    return [{ value: null, label: 'No items found' }];
  }
  return result;
}

function findCurrentItem(items, value) {
  return find(items, i => i.value === value) || (items && items[0]);
}

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
    const { items, query, value } = this.props;

    this.state = {
      isOpen: false,
      query: '',
      softSelected: null,
      items: filterItems(items, query),
      currentItem: findCurrentItem(items, value)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBgClick = this.handleBgClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps({ items, searchable, value }) {
    this.setState({
      items:
        searchable && this.state.query
          ? filterItems(items, this.state.query)
          : items,
      currentItem: findCurrentItem(items, value)
    });
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
    const query = ev.target.value;
    this.setState({
      query,
      items: filterItems(this.props.items, query)
    });
  }

  handleArrowNavigation(ev) {
    switch (ev.key) {
      case 'ArrowDown':
        console.log('down');
        break;
      case 'ArrowUp':
        console.log('up');
        break;
      default:
    }
  }

  render() {
    const { value, className, otherOptions, searchable } = this.props;
    const { isOpen, items, currentItem } = this.state;

    return (
      <div className={className}>
        <SelectedItem onClick={this.handleClick}>
          {searchable && isOpen ? (
            <Input
              focus
              onChange={this.handleSearch}
              onClick={e => e.stopPropagation()}
              onKeyDown={this.handleArrowNavigation}
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
              <Items>
                {map(items, i => (
                  <ItemWrapper
                    className="dropdown-item"
                    key={i.value}
                    unclickable={!i.value}
                    onClick={ev => i.value && this.handleChange(ev, i.value)}
                    selected={i.value === value}
                    title={i.label}
                  >
                    <Text italic={!i.value}>{i.label}</Text>
                  </ItemWrapper>
                ))}
              </Items>
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
  ),
  /**
   * If searchable, the dropdown will render an input box and filter out items in the dropdown list.
   */
  searchable: PropTypes.bool
};

export default StyledDropdown(Dropdown);
