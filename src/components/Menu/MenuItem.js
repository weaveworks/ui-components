import React from 'react';
import classnames from 'classnames';

/**
 * A child of the `<Menu />` component.
 *
 * See also [Menu](/components/menu)
 */
class MenuItem extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.text);
    }
  }

  render() {
    const { text, children, className, active } = this.props;
    // Use the className the users gives, or fall back to 'weave-menu-item'.
    const cl = classnames(className || 'weave-menu-item', {'menu-item-active': active});
    return (
      <div onClick={this.handleClick} className={cl}>
        <div className="menu-text">{text}</div>
        {children}
      </div>
    );
  }
}

MenuItem.propTypes = {
  /**
   * Handler that will be run on click. The `text` prop is passed to the handler function
   */
  onClick: React.PropTypes.func,
  /**
   * Text that will be displayed as the menu item.
   */
  text: React.PropTypes.string
};

export default MenuItem;
