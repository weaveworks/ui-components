import React from 'react';

import { Grid, GridRow } from '../Grid';
import Button from '../Button';

import Alert from '.';

const initial = {
  default: true,
  info: true,
  success: true,
  warning: true,
  error: true,
};

export default class AlertExample extends React.Component {
  constructor() {
    super();
    this.state = initial;
  }
  render() {
    const onClose = id => () => this.setState({ [id]: false });
    return (
      <Grid>
        <GridRow>
          <Alert visible={this.state.default} onClose={onClose('default')}>
            Default: This is a default alert. Its just giving you some info.
          </Alert>
        </GridRow>
        <GridRow>
          <Alert type="info" visible={this.state.info} onClose={onClose('info')}>
            Info: Please pay attention to this.
          </Alert>
        </GridRow>
        <GridRow>
          <Alert type="success" visible={this.state.success} onClose={onClose('success')}>
            Success: Great job! Wow! Much success!
          </Alert>
        </GridRow>
        <GridRow>
          <Alert type="warning" visible={this.state.warning} onClose={onClose('warning')}>
            Warning: Hmm, this is not good, but its not terrible.
          </Alert>
        </GridRow>
        <GridRow>
          <Alert type="error" visible={this.state.error} onClose={onClose('error')}>
            Error: Wow you really screwed this up...
          </Alert>
        </GridRow>
        <Button onClick={() => this.setState(initial)} text="Reset" />
      </Grid>
    );
  }
}
