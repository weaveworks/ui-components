/* eslint-disable react/no-danger */
import React from 'react';
import _ from 'lodash';

import Dialog from '../../src/components/Dialog';
import { renderMarkdown } from './utils';


export default class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogActive: false,
      callbackName: '',
      demoOutput: '',
      fetchingDocs: true
    };
    this.instrumentElement = this.instrumentElementProps.bind(this);
    this.renderPropTable = this.renderPropTable.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(propName, ...args) {
    this.setState({
      dialogActive: true,
      callbackName: propName,
      demoOutput: _.map(args, (arg) => {
        if (arg && arg.persist) {
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
  closeDialog() {
    this.setState({
      dialogActive: false
    });
  }
  render() {
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
        <Dialog
          onClose={this.closeDialog}
          active={this.state.dialogActive}
          actions={[]}
          overlay={false}
        >
          <div className="callback-name">{`"${this.state.callbackName}" called with:`}</div>
          {_.map(this.state.demoOutput, (o, i) => (
            <div key={o}>args[{i.toString()}]: {JSON.stringify(o)}</div>
          ))}
        </Dialog>
      </div>
    );
  }
}
