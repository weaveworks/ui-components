import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { map, find, filter, includes, lowerCase, concat } from 'lodash';

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
  background-color: ${props => (props.softSelected ? '#eee' : 'inherit')};

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

const Label = styled.div`
  line-height: initial;

  ${Text} {
    font-size: 12px;
  }
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

// For keyboard navigation
function moveSoftSelect({ softSelectedIndex, items }, amt) {
  const next =
    typeof softSelectedIndex === 'number' ? softSelectedIndex + amt : 0;

  // Keep the index within the upper bound of the array
  if (next > items.length - 1) {
    return softSelectedIndex;
  }

  // lower bound of the array
  if (next < 0) {
    return 0;
  }

  return next;
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
      softSelectedIndex: null,
      items: filterItems(items, query),
      currentItem: findCurrentItem(items, value)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    this.filterItems = this.filterItems.bind(this);
  }

  componentDidMount() {
    this.filterItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.filterItems(nextProps);
  }

  filterItems({ items, searchable, value, otherOptions }) {
    this.setState({
      items:
        searchable && this.state.query
          ? filterItems(items, this.state.query)
          : items,
      currentItem: findCurrentItem(concat(items, otherOptions), value)
    });
  }

  handleChange(ev, value) {
    this.setState({ isOpen: false });
    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  }

  handleToggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen, query: '' }));
  }

  handleSearch(ev) {
    const query = ev.target.value;
    this.setState({
      query,
      items: filterItems(this.props.items, query),
      softSelectedIndex: null
    });
  }

  handleKeyboardNavigation(ev) {
    switch (ev.key) {
      case 'ArrowDown':
        ev.preventDefault();
        this.setState(prevState => ({
          softSelectedIndex: moveSoftSelect(prevState, 1)
        }));
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.setState(prevState => ({
          softSelectedIndex: moveSoftSelect(prevState, -1)
        }));
        break;
      case 'Enter':
        ev.preventDefault();
        this.handleChange(
          ev,
          this.state.items[this.state.softSelectedIndex].value
        );
        break;
      case 'Escape':
        this.handleToggle();
        break;
      default:
    }
  }

  render() {
    const { value, className, otherOptions, searchable, label } = this.props;
    const { isOpen, items, currentItem, softSelectedIndex } = this.state;

    return (
      <div className={className}>
        <Label>
          <Text>{label}</Text>
        </Label>
        <SelectedItem onClick={this.handleToggle}>
          {searchable && isOpen ? (
            <Input
              focus
              onChange={this.handleSearch}
              onClick={e => e.stopPropagation()}
              onKeyDown={this.handleKeyboardNavigation}
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
                {map(items, (item, index) => (
                  <ItemWrapper
                    className="dropdown-item"
                    key={item.value}
                    unclickable={!item.value}
                    onClick={ev =>
                      item.value && this.handleChange(ev, item.value)
                    }
                    selected={item.value === value}
                    softSelected={index === softSelectedIndex}
                    title={item.label}
                  >
                    <Text italic={!item.value}>{item.label}</Text>
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
            <Overlay onClick={this.handleToggle} />
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
