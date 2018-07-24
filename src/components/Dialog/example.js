/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Example, Info } from '../../utils/example';
import Button from '../Button';

import Dialog from '.';

export default class DialogExample extends React.Component {
  state = {
    normalButtonActive: false,
    otherButtonActive: false,
    emptyButtonActive: false,
  };

  handleDialogActivate = (type, args) => {
    const key = `${type}ButtonActive`;
    if (this.state[key]) {
      this.props.clickHandler('onActionClick', args);
    }
    this.setState({
      [key]: !this.state[key],
    });
  };

  handleClose = () => {
    this.setState({
      normalButtonActive: false,
      otherButtonActive: false,
      emptyButtonActive: false,
    });
  };

  render() {
    const Action1 = () => (
      <Button
        onClick={this.handleDialogActivate.bind(
          this,
          'other',
          'Action 1 Payload'
        )}
      >
        Action 1
      </Button>
    );

    const Action2 = () => (
      <Button
        onClick={this.handleDialogActivate.bind(
          this,
          'other',
          'Action 2 Payload'
        )}
      >
        Action 2
      </Button>
    );
    return (
      <div>
        <Example>
          <Info>Normal dialog with overlay</Info>
          <Dialog
            active={this.state.normalButtonActive}
            actions={['Submit', 'Cancel']}
            onClose={this.handleClose}
            onActionClick={this.handleClose}
          >
            <p>Here is some content that I would like to display</p>
          </Dialog>
          <Button
            onClick={this.handleDialogActivate.bind(this, 'normal')}
            text="Dialog"
          />
        </Example>
        <Example>
          <Info>Dialog with pre-created actions</Info>
          <Button
            onClick={this.handleDialogActivate.bind(this, 'other')}
            text="Custom Actions"
          />
          <Dialog
            active={this.state.otherButtonActive}
            actions={[<Action1 />, <Action2 />]}
            onClose={this.handleClose}
            title="Dialog with title"
            width="400px"
          >
            <p>This one has custom actions</p>
          </Dialog>
        </Example>
        <Example>
          <Info>Dialog with no actions actions</Info>
          <Button
            onClick={this.handleDialogActivate.bind(this, 'empty')}
            text="No Actions"
          />
          <Dialog
            active={this.state.emptyButtonActive}
            onClose={this.handleClose}
            title="Dialog with title"
            width="300px"
          >
            <span>This one has no actions</span>
          </Dialog>
        </Example>
      </div>
    );
  }
}
