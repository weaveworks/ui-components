/* eslint-disable react/no-danger */
import React from 'react';
import { ObjectInspector } from 'react-inspector';
import _ from 'lodash';
import Hopup from '../../../src/components/Hopup';
import { renderMarkdown } from '../utils';

export default class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hopupActive: false,
      callbackName: '',
      demoOutput: ''
    };
    this.instrumentElement = this.instrumentElementProps.bind(this);
    this.renderPropTable = this.renderPropTable.bind(this);
    this.closeHopup = this.closeHopup.bind(this);
  }
  handleAction(propName, ...args) {
    this.setState({
      hopupActive: true,
      callbackName: propName,
      demoOutput: _.map(args, (arg) => {
        if (arg.persist) {
          // Synthetic mouse events throw warnings unless you persist them.
          arg.persist();
        }
        return arg;
      })
    });
  }
  instrumentElementProps() {
    return _.reduce(this.props.doc.props, (result, value, prop) => {
      if (value.type && value.type.name === 'func') {
        // Intercept any callbacks and inject the special `handleAction` method.
        // This allows a user to see what args get returned by interacting with the
        // component in the demo page.
        result[prop] = this.handleAction.bind(this, prop);
      }
      return result;
    }, {});
  }
  renderPropTable() {
    return (
      <table>
        <tbody>
          <tr className="header">
            <th>Prop Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
          {
            _.map(this.props.doc.props, (value, name) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{value.required && value.required.toString()}</td>
                <td>{value.type ? value.type.name : ''}</td>
                <td>{value.description}</td>
                <td>{value.defaultValue ? value.defaultValue.value : ''}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
  closeHopup(ev) {
    ev.preventDefault();
    this.setState({
      hopupActive: false
    });
  }
  render() {
    const { description, name } = this.props.doc;
    const newProps = this.instrumentElementProps();
    return (
      <div className="component-example">
        <h2>{name}</h2>
        <div className="content-section">
          <div className="description">
            <div dangerouslySetInnerHTML={renderMarkdown(description)} />
          </div>
        </div>
        <div className="content-section">
          <div className="prop-table">
            {this.props.doc.props && this.renderPropTable()}
          </div>
        </div>
        <div className="content-section">
          <div>
            <h3>Example</h3>
            <div className="component-demo">
              <div className="demo-wrap">
                {this.props.example
                  ? <this.props.example />
                  : <this.props.element {...this.props.element.props} {...newProps} />}
              </div>
            </div>
          </div>
          <Hopup
            onClose={this.closeHopup}
            active={this.state.hopupActive}
          >
            <div className="callback-name">{`"${this.state.callbackName}" called with:`}</div>
            <ObjectInspector data={this.state.demoOutput} />
          </Hopup>
        </div>
      </div>
    );
  }
}
