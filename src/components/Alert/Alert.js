import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Text from '../Text';
import { fromAtoms } from '../../utils/theme';

const StyledAlert = styled.div`
  display: flex;
  background: ${fromAtoms('Alert', 'type', 'background')};
  border-radius: ${props => props.theme.borderRadius.soft};
  border: 2px solid ${fromAtoms('Alert', 'type', 'borderColor')};
  color: ${fromAtoms('Alert', 'type', 'color')};
  margin: 8px 0 8px 0;
  min-height: 1em;
  opacity: ${props => (props.visible ? '1' : '0')};
  padding: 1em;
  transition: opacity 0.2s linear;

  a {
    color: ${fromAtoms('Alert', 'type', 'color')};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;

const Content = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  margin-bottom: 0.5em;
`;

const Icon = styled.i`
  margin-right: 0.5em;
`;

const CloseIcon = styled.i`
  cursor: pointer;
  display: ${props => (props.visible ? 'block' : 'none')};
  margin-left: 1em;
`;

const normaliseIconName = name =>
  name.indexOf('fa-') === -1 ? `fa-${name}` : name;

/**
 * An alert to let the user know about an action or state.
 * ```javascript
 * import { Alert } from 'weaveworks-ui-components';
 *
 * export default function() {
 *  return (
 *    <div>
 *     <Alert type="warning" visible={true}>
 *       Warning: Hmm, this is not good, but it is not terrible.
 *     </Alert>
 *    </div>
 *   )
 * }
 * ```
 */
function Alert(props) {
  const { children, icon, onClose, title, visible } = props;

  return (
    <StyledAlert {...props}>
      <Content>
        {title && (
          <Title>
            {icon && <Icon className={`fa ${normaliseIconName(icon)}`} />}
            <Text normal bold>
              {title}
            </Text>
          </Title>
        )}
        {children}
      </Content>
      {onClose && (
        <CloseIcon
          visible={visible}
          onClick={onClose}
          className="fa fa-remove"
        />
      )}
    </StyledAlert>
  );
}

Alert.propTypes = {
  /**
   * Show an icon for the title
   */
  icon: PropTypes.string,
  /**
   * Show a title for the alert
   */
  title: PropTypes.string,
  /**
   * Set the color scheme to indicate the nature of the alert.
   */
  type: PropTypes.oneOf(['default', 'info', 'success', 'warning', 'error']),
  /**
   * Toggle whether the alert is shown
   */
  visible: PropTypes.bool,
  /**
   * Callback that runs with the alert is dismissed by clicking the 'X'
   */
  onClose: PropTypes.func,
};

Alert.defaultProps = {
  icon: '',
  title: '',
  type: 'default',
  visible: true,
  onClose: null,
};

export default Alert;
