import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { spring, Motion } from 'react-motion';
import styled from 'styled-components';
import { format } from 'd3-format';
import { arc } from 'd3-shape';
import { isEmpty, isFinite } from 'lodash';

import theme from '../../theme';
import { spacing } from '../../theme/selectors';

const DIAL_RADIUS_PX = 85;
const DIAL_BORDER_PX = 8;

const roundedValuePercent = usage => {
  // The number is really small (< 0.01%), just indicate
  // the workload isn't using much resources at all.
  if (usage < 0.01) return 0;
  // Need to show 2 decimals when 0.01% <= usage < 0.1%.
  if (usage < 0.1) return format('.2f')(usage);
  // Let's only show 1 decimal when 0.1% <= usage < 5%.
  if (usage < 5) return format('.1f')(usage);
  // Show no decimal data when 10% <= usage
  return format('.0f')(usage);
};

const adjustArc = usage => {
  // Get rounded usage displayed inside the dial as a number [0, 1].
  const roundedUsage = Number(roundedValuePercent(usage * 100)) / 100;
  // If the displayed value is in the interval 0% < x < 1%, round up the dial arc to 1%.
  if (roundedUsage > 0 && roundedUsage < 0.01) return 0.01;
  // Otherwise, let the dial correspond to the displayed value.
  return roundedUsage;
};

const arcPath = arc()
  .innerRadius(DIAL_RADIUS_PX - DIAL_BORDER_PX)
  .outerRadius(DIAL_RADIUS_PX)
  .cornerRadius(5)
  .startAngle(0)
  .endAngle(percentage => 2 * Math.PI * adjustArc(percentage));

const DialLink = styled(Link)`
  border-radius: ${props => props.theme.borderRadius.circle};
  width: ${2 * DIAL_RADIUS_PX}px;
  height: ${2 * DIAL_RADIUS_PX}px;
  display: block;
`;

const DialContainer = styled.div`
  color: ${props => props.theme.colors.gray600};
  border-radius: ${props => props.theme.borderRadius.circle};
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: default;

  &:not([disabled]):hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const DialArc = styled.svg`
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
`;

const DialValueContainer = styled.div`
  display: flex;
  font-weight: bold;
`;

const DialValue = styled.div`
  font-size: ${props => props.theme.fontSizes.huge};
  margin: 0 ${spacing('xxs')};
`;

const PercentageSign = styled.div`
  font-size: ${props => props.theme.fontSizes.large};
  padding-top: 6px;
  overflow: visible;
  width: 0;
`;

const FillArc = ({ color, value = 1 }) => (
  <path
    transform={`translate(${DIAL_RADIUS_PX}, ${DIAL_RADIUS_PX})`}
    stroke="none"
    fill={color}
    d={arcPath(value)}
  />
);

const Label = styled.span`
  max-width: calc(100% - 40px);
  text-align: center;
`;

// TODO: Extract this into the theme.
const dialSpring = value =>
  spring(value, { damping: 13, precision: 0.01, stiffness: 50 });

class ResourceDial extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: null,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      value: this.props.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    // setState is async so triggers another render allowing animation to happen
    this.setState({
      value: nextProps.value,
    });
  }

  render() {
    const { value } = this.state;
    const { label, disabled, to, onClick } = this.props;
    const hasLink = !isEmpty(to) && !disabled;
    const hasValue = isFinite(value);

    return (
      <DialLink to={hasLink ? to : ''} onClick={onClick}>
        <Motion style={{ interpolatedValue: dialSpring(hasValue ? value : 0) }}>
          {({ interpolatedValue }) => (
            <DialContainer disabled={!hasLink}>
              <DialValueContainer>
                <DialValue>
                  {hasValue
                    ? roundedValuePercent(interpolatedValue * 100)
                    : '-'}
                </DialValue>
                {hasValue && <PercentageSign>%</PercentageSign>}
              </DialValueContainer>
              <Label>{label}</Label>
              <DialArc width="100%" height="100%">
                <FillArc color={theme.colors.gray100} />
                <FillArc
                  color={theme.colors.blue600}
                  value={interpolatedValue}
                />
              </DialArc>
            </DialContainer>
          )}
        </Motion>
      </DialLink>
    );
  }
}

ResourceDial.propTypes = {
  /**
   * Disables the link if set to true
   */
  disabled: PropTypes.bool,
  /**
   * Resource usage label shown below the percentage value
   */
  label: PropTypes.string.isRequired,
  /**
   * React router link for clicking on the dial
   */
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * The percentage value to be displayed by the dial, should be between 0 and 1
   */
  value: PropTypes.number,
};

ResourceDial.defaultProps = {
  disabled: false,
  to: '',
  value: null,
};

export default ResourceDial;
