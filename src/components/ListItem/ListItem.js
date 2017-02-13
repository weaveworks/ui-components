import React from 'react';

/**
 * A list item component that can be used for or showing off summary details about something!
 *
 * ```javascript
 * export default function ListItemExample({ clickHandler }) {
 *   const onClick = () => clickHandler('onClick', 'clicked it');
 *   return (
 *     <div>
 *       <ListItem
 *         onClick={onClick}
 *         text="Item 1"
 *         />
 *       <ListItem
 *         onClick={onClick}
 *         text="Item 2"
 *         subText="Where do you go to?"
 *         />
 *     </div>
 *   );
 * }
 * ```
 */


class ListItem extends React.Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    ev.preventDefault();
    const { onClick, value } = this.props;
    if (onClick) {
      onClick(value);
    }
  }

  render() {
    const { active, text, subText, onClick, children, style } = this.props;
    const BaseTag = onClick ? 'a' : 'div';
    const props = onClick && { href: '#' };
    const className = `weave-list-item${active ? ' weave-list-item-active' : ''}`;
    return (
      <BaseTag style={style} className={className} onClick={this.handleClick} {...props}>
        {text && <div className="weave-list-item-text">{text}</div>}
        {children}
        {subText && <span className="weave-list-item-subtext">{subText}</span>}
      </BaseTag>
    );
  }
}


ListItem.propTypes = {
  active: React.PropTypes.bool,
  text: React.PropTypes.any,
  subText: React.PropTypes.any,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
  value: React.PropTypes.any
};


export default ListItem;
