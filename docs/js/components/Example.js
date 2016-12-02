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
      demoOutput: '',
      fetchingDocs: true
    };
    this.instrumentElement = this.instrumentElementProps.bind(this);
    this.renderPropTable = this.renderPropTable.bind(this);
    this.closeHopup = this.closeHopup.bind(this);
    this.handleAction = this.handleAction.bind(this);
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
  instrumentElementProps(props) {
    return _.reduce(props, (result, value, prop) => {
      if (value.type && value.type.name === 'func') {
        // Intercept any callbacks and inject the special `handleAction` method.
        // This allows a user to see what args get returned by interacting with the
        // component in the demo page.
        result[prop] = this.handleAction.bind(this, prop);
      }
      return result;
    }, {});
  }
  renderPropTable(props) {
    return (
      <table className="weave-table">
        <tbody>
          <tr className="weave-table-header">
            <th>Prop Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
          {
            _.map(props, (value, name) => (
              <tr className="weave-table-row" key={name}>
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
    // Docs are rendered as JSON by a webpack loader/plugin. When the component mounts,
    // it does a network request to fetch its docs, then renders based on the data returned.
    const { description, props } = this.props.doc;
    const newProps = this.instrumentElementProps(props);
    return (
      <div className="component-example">
        <h2>{this.props.name}</h2>
        <div className="content-section">
          <div className="description">
            <div dangerouslySetInnerHTML={renderMarkdown(description)} />
          </div>
        </div>
        <div className="content-section">
          <div className="prop-table">
            {props && this.renderPropTable(props)}
          </div>
        </div>
        {!this.props.isSubComponent &&
          <div className="content-section">
            <div className="weave-panel">
              <div className="weave-panel-header">
                <h3>Example</h3>
              </div>
              <div className="weave-panel-body">
                <div className="component-demo">
                  <div className="demo-wrap">
                    {this.props.example
                      ? <this.props.example clickHandler={this.handleAction} />
                      : <this.props.element {...this.props.element.props} {...newProps} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <Hopup
          onClose={this.closeHopup}
          active={this.state.hopupActive}
        >
          <div className="callback-name">{`"${this.state.callbackName}" called with:`}</div>
          <ObjectInspector data={this.state.demoOutput} />
        </Hopup>
      </div>
    );
  }
}
