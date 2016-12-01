import React from 'react';

export default class ComponentExamplePage extends React.Component {
  render() {
    return (
      <div className="component-example-page">
        {this.props.children}
      </div>
    );
  }
}
