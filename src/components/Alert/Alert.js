import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Text from '../Text';
import { spacing } from '../../theme/selectors';
import { fromAtoms } from '../../utils/theme';

const StyledAlert = styled.div`
  display: flex;
  background: ${fromAtoms('Alert', 'type', 'background')};
  border-radius: ${props => props.theme.borderRadius.soft};
  color: ${fromAtoms('Alert', 'type', 'color')};
  margin: ${spacing('xs')} 0 ${spacing('xs')} 0;
  min-height: 1em;
  opacity: ${props => (props.visible ? '1' : '0')};
  padding: ${spacing('base')};
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
  margin-bottom: ${spacing('xs')};
`;

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.white};
  font-weight: bold;
`;

const Icon = styled.i`
  margin-right: ${spacing('xs')};
`;

const CloseIcon = styled.i`
  cursor: pointer;
  display: ${props => (props.visible ? 'block' : 'none')};
  margin-left: ${spacing('base')};
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
  const { children, icon, title, visible } = props;
  const { onClose, ...otherProps } = props;

  return (
    <StyledAlert {...otherProps}>
      <Content>
        {title && (
          <Title>
            {icon && <Icon className={`fa ${normaliseIconName(icon)}`} />}
            <StyledText>{title}</StyledText>
          </Title>
        )}
        {children}
      </Content>
      {onClose && (
        <CloseIcon
          visible={visible}
          onClick={onClose}
          className="fa fa-times"
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
   * Callback that runs with the alert is dismissed by clicking the 'X'
   */
  onClose: PropTypes.func,
  /**
   * Show a title for the alert
   */
  title: PropTypes.string,
  /**
   * Set the color scheme to indicate the nature of the alert.
   */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /**
   * Toggle whether the alert is shown
   */
  visible: PropTypes.bool,
};

Alert.defaultProps = {
  icon: '',
  onClose: null,
  title: '',
  type: 'info',
  visible: true,
};

export default Alert;
