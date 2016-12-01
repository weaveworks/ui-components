import React from 'react';

class MenuItem extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(this.props.text);
  }

  render() {
    const { text, children } = this.props;
    return (
      <div onClick={this.handleClick} className="weave-menu-item">
        <div className="menu-text">{text}</div>
        {children}
      </div>
    );
  }
}

MenuItem.propTypes = {
  onClick: React.PropTypes.func,
  text: React.PropTypes.string
};

export default MenuItem;
