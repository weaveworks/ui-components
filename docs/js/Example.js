/* eslint-disable react/no-danger */
import React from 'react';
import styled from 'styled-components';
import { map, reduce } from 'lodash';
import { transparentize } from 'polished';

import Dialog from '../../src/components/Dialog';
import { renderMarkdown } from './utils';

const Panel = styled.div`
  box-shadow: ${props => props.theme.boxShadow.light};
`;

const PanelHeader = styled.div`
  height: 50px;
  padding-left: 20px;
  background-color: ${props => props.theme.colors.athens};
  color: ${props => props.theme.colors.gunpowder};

  &:first-child {
    line-height: 50px;
  }
`;

const PanelBody = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-collapse: collapse;
  border-left-color: ${props => props.theme.colors.gray};
  border-right-color: ${props => props.theme.colors.gray};
  border-top-color: ${props => props.theme.colors.gray};
`;

const TableHeader = styled.tr`
  box-shadow: 0 4px 2px -2px ${props => transparentize(0.84, props.theme.colors.black)};
  border-bottom: 1px solid ${props => props.theme.colors.gray};

  th {
    color: ${props => props.theme.colors.primary.lavender};
    font-size: ${props => props.theme.fontSizes.tiny};
    font-weight: normal;
    text-transform: uppercase;
  }
`;

const TableRow = styled.tr`
  color: ${props => props.theme.colors.gunpowder};
  font-size: ${props => props.theme.fontSizes.small};

  &:nth-child(odd) {
    background-color: ${props => props.theme.colors.athens};
  }

  td {
    padding: 3px 4px;
  }
`;

function getReadableValueType(type) {
  if (!type) return '';
  if (type.name === 'instanceOf') return type.value;
  return type.name;
}

function getDefaultValue(defaultValue) {
  if (!defaultValue) return '';

  // If default value is a function, show only its name.
  if (defaultValue.value.indexOf('function') === 0) {
    return defaultValue.value.split('(')[0];
  }

  return defaultValue.value;
}

export default class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogActive: false,
      callbackName: '',
      demoOutput: '',
      fetchingDocs: true,
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
      demoOutput: map(args, arg => {
        if (arg && arg.persist) {
          // Synthetic mouse events throw warnings unless you persist them.
          arg.persist();
        }
        return arg;
      }),
    });
  }
  instrumentElementProps(props) {
    return reduce(
      props,
      (result, value, prop) => {
        if (value.type && value.type.name === 'func') {
          // Intercept any callbacks and inject the special `handleAction` method.
          // This allows a user to see what args get returned by interacting with the
          // component in the demo page.
          result[prop] = this.handleAction.bind(this, prop);
        }
        return result;
      },
      {}
    );
  }
  closeDialog() {
    this.setState({
      dialogActive: false,
    });
  }
  renderPropTable(props) {
    return (
      <Table>
        <tbody>
          <TableHeader>
            <th>Prop Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
            <th>Default</th>
          </TableHeader>
          {map(props, (value, name) => (
            <TableRow key={name}>
              <td>{name}</td>
              <td>{value.required && value.required.toString()}</td>
              <td>{getReadableValueType(value.type)}</td>
              <td>{value.description}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {getDefaultValue(value.defaultValue)}
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  }
  render() {
    const { description, props } = this.props.doc;
    const newProps = this.instrumentElementProps(props);
    return (
      <div className="component-example">
        <h2>{this.props.name}</h2>
        <div className="content-section">
          <div className="description markdown-body">
            <div dangerouslySetInnerHTML={renderMarkdown(description)} />
          </div>
        </div>
        <div className="content-section">
          <div className="prop-table">
            {props && this.renderPropTable(props)}
          </div>
        </div>
        {!this.props.isSubComponent && (
          <div className="content-section">
            <Panel>
              <PanelHeader>
                <h3>Example</h3>
              </PanelHeader>
              <PanelBody>
                <div className="component-demo">
                  <div className="demo-wrap">
                    {this.props.example ? (
                      <this.props.example clickHandler={this.handleAction} />
                    ) : (
                      <this.props.element
                        {...this.props.element.props}
                        {...newProps}
                      />
                    )}
                  </div>
                </div>
              </PanelBody>
            </Panel>
          </div>
        )}
        <Dialog
          onClose={this.closeDialog}
          active={this.state.dialogActive}
          actions={[]}
          overlay
        >
          <div className="callback-name">{`"${
            this.state.callbackName
          }" called with:`}</div>
          {map(this.state.demoOutput, (o, i) => (
            <div key={o}>
              args[{i.toString()}]: {JSON.stringify(o)}
            </div>
          ))}
        </Dialog>
      </div>
    );
  }
}
