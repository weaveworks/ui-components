import React from 'react';

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

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.onClick(this.props.text);
  }

  render() {
    const { text, children, className } = this.props;
    return (
      <div onClick={this.handleClick} className={className || 'weave-menu-item'}>
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
