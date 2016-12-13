import React from 'react';

import Button from '../Button';

/**
 * A dialog window
 * ```javascript
 * export defaut function DialogExample({closeHandler, actionClickHandler}) {
 *  return (
 *   <Dialog
 *      active={true}
 *      actions={['Submit', 'Cancel']}
 *      onClose={closeHandler}
 *      onActionClick={actionClickHandler}
 *    >
 *      <p>Here is some content that I would like to display</p>
 *    </Dialog>
 *  );
 * }
 * ```
 *
 * Example with pre-created action elements
 * ```javascript
 * export defaut function DialogExample({someHandlerFunc, otherHandlerFunc, handleClose}) {
 *     const Action1 = () => (
 *      <div onClick={someHandlerFunc}>Action1</div>
 *    );
 *     const Action2 = () => (
 *       <div onClick={otherHandlerFunc}>Action2</div>
 *    );
 *
 *    return (
 *      <Dialog
 *         active={true}
 *         actions={[Action1, Action2]}
 *         onClose={handleClose}
 *       >
 *         <p>This one has custom actions</p>
 *       </Dialog>
 *    );
 * }
 * ```
 */

class Dialog extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleActionClick(text) {
    this.props.onActionClick(text);
  }
  handleClose() {
    this.props.onClose();
  }
  render() {
    const { children, active, actions, overlay } = this.props;
    return (
      <div className={active ? 'weave-dialog active' : 'weave-dialog'}>
        <div className="weave-dialog-window">
          <div className="weave-dialog-close">
            <span onClick={this.handleClose} className="fa fa-close" />
          </div>
          <div className="weave-dialog-content">
            {children}
          </div>
          <div className="weave-dialog-actions">
            {actions.map((Action, i) => {
              if (React.isValidElement(Action)) {
                return React.cloneElement(Action, { key: i });
              }
              return (<Button key={i} onClick={this.handleActionClick} text={Action} />);
            })}
          </div>
        </div>
        <div
          onClick={this.handleClose}
          className={overlay ? 'weave-dialog-overlay overlay-active' : 'disabled'} />
      </div>
    );
  }
}

Dialog.propTypes = {
  /**
   * Flag to show/hide the dialog
   */
  active: React.PropTypes.bool,
  /**
   * An array of options that the user will be able to click.
   * Each item in the array will be rendered as a <Button /> in the dialog window.
   * Items can also be React elements.
   */
  actions: React.PropTypes.array,
  /**
   * Callback that will be run when the dialog is closed
   */
  onClose: React.PropTypes.func,
  /**
   * Callback that runs when an action is clicked by the user. If the actions
   * If the `actions` prop is an array of strings,
   * this callback will return the action that was clicked.
   */
  onActionClick: React.PropTypes.func,
  /**
   * Toggles a modal overlay. If set to true, the overlay will appear,
   */
  overlay: React.PropTypes.bool
};

Dialog.defaultProps = {
  overlay: true
};

export default Dialog;
