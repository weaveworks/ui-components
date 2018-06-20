import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { map, find, flattenDepth, isArray } from 'lodash';

const WIDTH = '256px';
const HEIGHT = '36px';

const Item = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 12px;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.soft};
  z-index: ${props => props.theme.layers.dropdown};
  box-shadow: ${props => props.theme.boxShadow.light};
  margin-top: 4px;
  width: ${WIDTH};
  box-sizing: border-box;
  padding: 6px 0;
`;

const Overlay = styled.div`
  z-index: ${props => props.theme.layers.dropdown};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const ItemWrapper = Item.extend`
  line-height: ${HEIGHT};
  color: ${props =>
    props.selected ? props.theme.colors.blue400 : props.theme.textColor};
  min-height: ${HEIGHT};

  &:hover {
    background-color: ${props => props.theme.colors.gray50};
  }
`;

const Divider = styled.div`
  margin: 6px 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
`;

const SelectedItem = Item.extend`
  border-radius: ${props => props.theme.borderRadius.soft};
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray600};
  display: flex;

  ${Item} {
    padding: 0;
  }

  div:last-child {
    margin-left: auto;
  }
`;

const SelectedItemIcon = styled.span`
  padding-left: 1em;
  float: right;
  line-height: ${HEIGHT} !important;
`;

const StyledDropdown = component => styled(component)`
  height: ${HEIGHT};
  line-height: ${HEIGHT};
  position: relative;
  padding: 8px;
  width: ${WIDTH};
`;


const DefaultToggleView = ({ onClick, selectedLabel }) => (
  <SelectedItem onClick={onClick}>
    <Item>{selectedLabel}</Item>
    <div>
      <SelectedItemIcon className="fa fa-caret-down" />
    </div>
  </SelectedItem>);


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
 * ];
 *
 * <Dropdown items={items} />
 * ```
 *
 * You  may also add `null` for dividers or provide groups that will be separated
 * ```javascript
 *const items = [
 *  [
 *    {
 *      value: 'first-thing',
 *      label: 'First Thing',
 *    },
 *    {
 *      value: 'second-thing',
 *      label: 'Second Thing',
 *    },
 *  ],
 *  [
 *    {
 *      value: 'another-thing',
 *      label: 'Another Thing',
 *    },
 *  ]
 * ];
 * ```
 */
class Dropdown extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBgClick = this.handleBgClick.bind(this);
  }

  handleChange(ev, value) {
    this.setState({ isOpen: false });
    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }
  }

  handleClick() {
    this.setState({ isOpen: true });
  }

  handleBgClick() {
    this.setState({ isOpen: false });
  }

  divide(items) {
    if (!items || !isArray(items[0])) {
      return items;
    }

    return flattenDepth(items.map(it => [null, it]), 2).slice(1);
  }

  render() {
    const { items, value, className, placeholder } = this.props;
    const { isOpen } = this.state;
    const divided = this.divide(items);
    // If nothing is selected, use the placeholder, else use the first item.
    const currentItem =
      find(divided, i => i && i.value === value) ||
      (placeholder
        ? { label: placeholder, value: null }
        : divided && divided[0]);
    const label = currentItem && currentItem.label;
    const Component = this.props.withComponent;

    return (
      <div className={className} title={label}>
        <Component selectedLabel={label} onClick={this.handleClick} />
        {isOpen && (
          <div>
            <Overlay onClick={this.handleBgClick} />
            <Popover>
              {map(
                divided,
                (item, index) =>
                  item ? (
                    <ItemWrapper
                      className="dropdown-item"
                      key={item.value}
                      onClick={ev => this.handleChange(ev, item.value)}
                      selected={item.value === value}
                      title={item && item.label}
                    >
                      {item.label}
                    </ItemWrapper>
                  ) : (
                    <Divider key={index} />
                  )
              )}
            </Popover>
          </div>
        )}
      </div>
    );
  }
}

const itemPropType = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
});

Dropdown.propTypes = {
  /**
   * Array of items (or groups of items) that will be selectable.
   * `value` should be an internal value,
   * `label` is what will be displayed to the user.
   */
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(itemPropType), itemPropType])
  ).isRequired,
  /**
   * The value of the currently selected item. This much match a value in the `items` prop.
   * If no value is provided, the first elements's value will be used.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * A handler function that will run when a value is selected.
   */
  onChange: PropTypes.func,
  /**
   * The initial text that will be display before a user selects an item.
   */
  placeholder: PropTypes.string,

  /**
   * A custom component to replace the default toggle view.
   * The properties `selectedLabel` and `onClick` are provided. `onClick` needs to be incorporated
   * to make the dropdown list toggle.
   */
  withComponent: PropTypes.func,
};

Dropdown.defaultProps = {
  withComponent: DefaultToggleView,
};

export default StyledDropdown(Dropdown);
