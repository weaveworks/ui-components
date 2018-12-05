import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { noop, isEmpty } from 'lodash';

import Button from '../Button';
import { spacing } from '../../theme/selectors';

const Wrapper = styled.div`
  z-index: ${props => props.theme.layers.modal};
  transition: opacity 0.2s ease;
  align-items: center;
  position: fixed;
  display: flex;
  opacity: 0;
  height: 100%;
  left: -100%;
  width: 100%;
  top: 0;

  ${props =>
    props.active &&
    `
    left: 0;
    opacity: 1;
  `};
`;

const Overlay = styled.div`
  background-color: ${props => props.theme.colors.black};
  position: absolute;
  opacity: 0.3;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;

  /* Currently not supported by most of the browsers, but the future is near :) */
  backdrop-filter: blur(2px);
`;

const Window = styled.div`
  box-shadow: ${props => props.theme.boxShadow.light};
  border-radius: ${props => props.theme.borderRadius.soft};
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.purple800};
  width: ${props => props.width};
  margin: 0 auto;
  max-width: 768px;
  padding: ${spacing('base')} ${spacing('medium')} ${spacing('medium')};
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: bold;
`;

const ButtonClose = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  margin-right: -${spacing('xxs')};
  padding: ${spacing('xxs')};
  outline: 0;

  &:hover {
    opacity: 0.5;
  }
`;

const Content = styled.div``;

const Actions = styled.div`
  text-align: right;
  min-height: 36px;

  button {
    margin-left: ${spacing('small')};
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
class Dialog extends PureComponent {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = event => {
    if (this.props.active && event.key === 'Escape') {
      this.props.onClose(event);
    }
  };

  render() {
    const {
      active,
      hideClose,
      title,
      width,
      actions,
      onActionClick,
      onClose,
      children,
    } = this.props;

    return (
      <Wrapper active={active}>
        <Overlay onClick={onClose} />
        <Window width={width}>
          <Header>
            <Title>{title}</Title>
            {!hideClose && (
              <ButtonClose text="" onClick={onClose}>
                <i className="fa fa-times" />
              </ButtonClose>
            )}
          </Header>
          <Content>{active && children}</Content>
          {!isEmpty(actions) && (
            <Actions>
              {actions.map((Action, index) => {
                if (React.isValidElement(Action)) {
                  /* eslint-disable react/no-array-index-key */
                  return React.cloneElement(Action, { key: index });
                  /* eslint-enable react/no-array-index-key */
                }
                return (
                  <Button
                    key={Action}
                    text={Action}
                    onClick={() => onActionClick(Action)}
                  />
                );
              })}
            </Actions>
          )}
        </Window>
      </Wrapper>
    );
  }
}

Dialog.propTypes = {
  /**
   * Flag to show/hide the dialog
   */
  active: PropTypes.bool.isRequired,
  /**
   * The title of the dialog
   */
  title: PropTypes.string,
  /**
   * Width of the dialog window (CSS format)
   */
  width: PropTypes.string,
  /**
   * An array of options that the user will be able to click.
   * Each item in the array will be rendered as a <Button /> in the dialog window.
   * Items can also be React elements.
   */
  actions: PropTypes.array,
  /**
   * Callback that runs when an action is clicked by the user. If the actions
   * If the `actions` prop is an array of strings,
   * this callback will return the action that was clicked.
   */
  onActionClick: PropTypes.func,
  /**
   * Callback that will be run when the modal is closed
   */
  onClose: PropTypes.func,
  /**
   * Flag to hide the close icon in top right corner
   */
  hideClose: PropTypes.bool,
};

Dialog.defaultProps = {
  title: '',
  width: '75%',
  actions: [],
  onActionClick: noop,
  onClose: noop,
  hideClose: false,
};

export default Dialog;
