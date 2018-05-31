import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '../Button';

const Wrapper = styled.div`
  transition: opacity 0.2s ease;
  position: fixed;
  padding-top: 30vh;
  opacity: 0;
  height: 100%;
  left: -100%;
  top: 0;
  width: 100%;

  &.active {
    left: 0;
    opacity: 1;
  }
`;

const Overlay = styled.div`
  background-color: ${props => props.theme.colors.black};
  opacity: 0;
  position: absolute;
  z-index: 2;
  height: 100%;
  left: -100%;
  top: 0;
  width: 100%;

  & {
    opacity: 0.5;
    left: 0;
  }
`;

const Window = styled.div`
  box-shadow: ${props => props.theme.boxShadow.light};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gunpowder};
  margin: 0 auto;
  max-width: 768px;
  padding: 20px;
  width: ${props => props.width};
  z-index: 30;
  position: relative;
`;

const ButtonClose = styled.div`
  text-align: right;

  & > span:hover {
    cursor: pointer;
  }
`;

const Actions = styled.div`
  text-align: right;
  min-height: 36px;

  button:first-child {
    margin-right: 10px;
  }
`;

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
  handleActionClick = text => {
    this.props.onActionClick(text);
  };

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { children, active, actions, overlay, width } = this.props;
    return (
      <Wrapper className={active ? 'weave-dialog active' : 'weave-dialog'}>
        <Window width={width} className="weave-dialog-window">
          <ButtonClose className="weave-dialog-close">
            <span onClick={this.handleClose} className="fa fa-close" />
          </ButtonClose>
          <div className="weave-dialog-content">{children}</div>
          <Actions className="weave-dialog-actions">
            {actions &&
              actions.map((Action, i) => {
                if (React.isValidElement(Action)) {
                  return React.cloneElement(Action, { key: i });
                }
                return (
                  <Button
                    key={i}
                    onClick={() => this.handleActionClick(Action)}
                    text={Action}
                  />
                );
              })}
          </Actions>
        </Window>
        {overlay && (
          <Overlay
            onClick={this.handleClose}
            className="weave-dialog-overlay"
          />
        )}
      </Wrapper>
    );
  }
}

Dialog.propTypes = {
  /**
   * Flag to show/hide the dialog
   */
  active: PropTypes.bool,
  /**
   * An array of options that the user will be able to click.
   * Each item in the array will be rendered as a <Button /> in the dialog window.
   * Items can also be React elements.
   */
  actions: PropTypes.array,
  /**
   * Callback that will be run when the dialog is closed
   */
  onClose: PropTypes.func,
  /**
   * Callback that runs when an action is clicked by the user. If the actions
   * If the `actions` prop is an array of strings,
   * this callback will return the action that was clicked.
   */
  onActionClick: PropTypes.func,
  /**
   * Toggles a modal overlay. If set to true, the overlay will appear,
   */
  overlay: PropTypes.bool,

  /**
   * Width of the dialog content.
   */
  width: PropTypes.string
};

Dialog.defaultProps = {
  overlay: true,
  width: '75%',
};

export default Dialog;
