import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HEIGHT_PX = 27;

const RangeSelectorWrapper = styled.div`
  border-left: 1px solid ${props => props.theme.colors.gray200};
  min-width: 75px;
`;

const SelectedRangeWrapper = styled.div`
  background-color: transparent;
  cursor: pointer;
  padding: 3px 8px;
  display: flex;
  justify-content: space-between;
  line-height: 21px;
`;

const SelectedRange = styled.div`
  color: ${props => props.theme.colors.purple900};
`;

const RangeOptionsListWrapper = styled.div`
  z-index: ${props => props.theme.layers.dropdown};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const RangeOptionsList = styled.div`
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray200};
  color: ${props => props.theme.colors.purple900};
  box-sizing: border-box;
  position: absolute;
  text-align: left;
`;

const CaretIconsContainer = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;

  .fa {
    font-size: ${props => props.theme.fontSizes.tiny};
    line-height: 7px;
  }
`;

const RangeOption = styled.div`
  line-height: ${HEIGHT_PX}px;
  cursor: pointer;
  padding: 0 8px;

  &:hover {
    background-color: ${props => props.theme.colors.gray50};
  }

  ${props =>
    props.selected &&
    `
    color: ${props.theme.colors.blue400};
  `};
`;

const rangeOptions = [
  { label: '15min', valueMs: moment.duration(15, 'minutes').asMilliseconds() },
  { label: '30min', valueMs: moment.duration(30, 'minutes').asMilliseconds() },
  { label: '1h', valueMs: moment.duration(1, 'hour').asMilliseconds() },
  { label: '3h', valueMs: moment.duration(3, 'hours').asMilliseconds() },
  { label: '6h', valueMs: moment.duration(6, 'hours').asMilliseconds() },
  { label: '24h', valueMs: moment.duration(24, 'hours').asMilliseconds() },
];

class RangeSelector extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
    };

    this.saveNodeRef = this.saveNodeRef.bind(this);
    this.handleDropDownClick = this.handleDropDownClick.bind(this);
    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
  }

  handleDropDownClick() {
    this.setState({ isOpen: true });
  }

  handleBackgroundClick() {
    this.setState({ isOpen: false });
  }

  saveNodeRef(ref) {
    this.containerRef = ref;
  }

  render() {
    const { rangeMs } = this.props;
    const { isOpen } = this.state;

    const selectedRangeIndex = rangeOptions.findIndex(r => r.valueMs === rangeMs);
    const selectedRangeLabel = rangeOptions.find(r => r.valueMs === rangeMs).label;
    const anchorEl = this.containerRef && this.containerRef.getBoundingClientRect();
    const menuStyle = anchorEl
      ? {
        top: anchorEl.top - (selectedRangeIndex * HEIGHT_PX) - 1,
        left: anchorEl.right - anchorEl.width,
        minWidth: anchorEl.width + 1,
      }
      : {};

    return (
      <RangeSelectorWrapper innerRef={this.saveNodeRef}>
        <SelectedRangeWrapper onClick={this.handleDropDownClick}>
          <SelectedRange>{selectedRangeLabel}</SelectedRange>
          <CaretIconsContainer>
            <span className="fa fa-caret-up" />
            <span className="fa fa-caret-down" />
          </CaretIconsContainer>
        </SelectedRangeWrapper>
        {isOpen && (
          <RangeOptionsListWrapper onClick={this.handleBackgroundClick}>
            <RangeOptionsList style={menuStyle}>
              {rangeOptions.map(({ valueMs, label }) => (
                <RangeOption
                  key={valueMs}
                  selected={valueMs === rangeMs}
                  onClick={() => this.props.onChange(valueMs)}
                >
                  {label}
                </RangeOption>
              ))}
            </RangeOptionsList>
          </RangeOptionsListWrapper>
        )}
      </RangeSelectorWrapper>
    );
  }
}

RangeSelector.propTypes = {
  rangeMs: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RangeSelector;
