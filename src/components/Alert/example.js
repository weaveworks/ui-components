import React from 'react';

import { Example } from '../../utils/example';
import Button from '../Button';

import Alert from '.';

const initial = {
  default: true,
  error: true,
  info: true,
  multi: true,
  multiTitle: true,
  success: true,
  warning: true,
};

export default class AlertExample extends React.Component {
  constructor() {
    super();
    this.state = initial;
  }
  render() {
    const onClose = id => () => this.setState({ [id]: false });
    return (
      <div>
        <Example>
          <Alert
            type="info"
            visible={this.state.info}
            onClose={onClose('info')}
          >
            Info: Please pay attention to this.
          </Alert>
        </Example>
        <Example>
          <Alert
            type="success"
            visible={this.state.success}
            onClose={onClose('success')}
          >
            Success: Great job! Wow! Much success!
          </Alert>
        </Example>
        <Example>
          <Alert
            type="warning"
            visible={this.state.warning}
            onClose={onClose('warning')}
          >
            Warning: Hmm, this is not good, but it is not terrible.
          </Alert>
        </Example>
        <Example>
          <Alert
            type="error"
            visible={this.state.error}
            onClose={onClose('error')}
          >
            Error: Wow you really screwed this up...
          </Alert>
        </Example>
        <Button onClick={() => this.setState(initial)} text="Reset" />
      </div>
    );
  }
}
