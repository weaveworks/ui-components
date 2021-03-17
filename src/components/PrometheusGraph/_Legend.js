import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { size, without } from 'lodash';

const LegendContainer = styled.div`
  opacity: ${props => (props.$loading ? 0.35 : 1)};
`;

const LegendItems = styled.div`
  color: ${props => props.theme.colors.black};
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 10px 0;
  width: 100%;
`;

const LegendItem = styled.div`
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.fontSizes.small};
  align-items: flex-start;
  padding: 2px 22px 2px 7px;
  margin-right: 2px;
  margin-bottom: 2px;
  border-radius: ${props => props.theme.borderRadius.soft};

  &:hover {
    background-color: ${props => props.theme.colors.purple100};
  }

  ${props =>
    props.selected &&
    `
    background-color: ${props.theme.colors.purple100};
  `};
`;

const LegendItemName = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 36ch;

  ${props =>
    props.multiLine &&
    `
    white-space: normal;
    max-height: 32px;
  `};

  ${LegendItem}:hover & {
    ${props =>
      props.multiLine && // eslint-disable-line
      `
        max-height: 100%;
        word-break: break-word;
        text-overflow: normal;
    `};
  }
`;

const LegendToggle = styled.span`
  color: ${props => props.theme.colors.purple400};
  cursor: pointer;
  display: block;
  padding: 5px;
  font-size: ${props => props.theme.fontSizes.normal};
  width: fit-content;
`;

const LegendCaret = styled.span`
  margin-left: 5px;
`;

const ColorBox = styled.span`
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.soft};
  margin-top: 5px;
  margin-right: 4px;
  min-width: 13px;
  height: 5px;
`;

class Legend extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedKeys: props.selectedKeys,
      shown: props.shown,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedKeys !== nextProps.selectedKeys) {
      this.setState({ selectedKeys: nextProps.selectedKeys });
    }
  }

  handleLegendItemClick = (ev, series) => {
    let { selectedKeys } = this.state;

    if (ev.ctrlKey || ev.metaKey) {
      // If the Ctrl button is pressed while selecting
      // the legend item, simply toggle its presence.
      selectedKeys = this.seriesSelected(series)
        ? without(selectedKeys, series.key)
        : [series.key, ...selectedKeys].sort();
    } else {
      // If Ctrl button is not pressed, select only the clicked item,
      // unless it's the only one selected, in which case remove the selection.
      const onlyThisSelected =
        this.seriesSelected(series) && selectedKeys.length === 1;
      selectedKeys = onlyThisSelected ? [] : [series.key];
    }

    this.setState({ selectedKeys });
    this.props.onSelectedKeysChange(selectedKeys);
  };

  handleLegendItemMouseEnter = series => {
    this.props.onHoveredKeyChange(series.key);
  };

  handleLegendItemMouseLeave = () => {
    this.props.onHoveredKeyChange(null);
  };

  handleLegendToggle = () => {
    this.setState({ shown: !this.state.shown });
  };

  seriesSelected = series => this.state.selectedKeys.includes(series.key);
  seriesHovered = series => this.props.hoveredKey === series.key;

  render() {
    const caretIcon = this.state.shown ? 'fa-caret-down' : 'fa-caret-right';

    return (
      <LegendContainer $loading={this.props.loading}>
        {this.props.collapsable && (
          <LegendToggle onClick={this.handleLegendToggle}>
            Legend <LegendCaret className={`fa ${caretIcon}`} />
          </LegendToggle>
        )}
        {this.state.shown && (
          <LegendItems>
            {this.props.multiSeries.map(series => {
              const multiLine = size(series.legendNameParts) > 1;
              const selected = this.seriesSelected(series);
              const hovered = this.seriesHovered(series);

              return (
                <LegendItem
                  key={series.key}
                  title={series.hoverName.join('\n')}
                  onClick={ev => this.handleLegendItemClick(ev, series)}
                  onMouseEnter={() => this.handleLegendItemMouseEnter(series)}
                  onMouseLeave={() => this.handleLegendItemMouseLeave()}
                  selected={selected}
                >
                  <ColorBox color={series.color} />
                  <LegendItemName multiLine={multiLine}>
                    {series.legendNameParts.join('\n')}
                  </LegendItemName>
                  {this.props.renderItemSuffix(series, { hovered, selected })}
                </LegendItem>
              );
            })}
          </LegendItems>
        )}
      </LegendContainer>
    );
  }
}

Legend.propTypes = {
  collapsable: PropTypes.bool.isRequired,
  hoveredKey: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  multiSeries: PropTypes.array.isRequired,
  onHoveredKeyChange: PropTypes.func.isRequired,
  onSelectedKeysChange: PropTypes.func.isRequired,
  selectedKeys: PropTypes.array.isRequired,
  shown: PropTypes.bool.isRequired,
};

Legend.defaultProps = {
  hoveredKey: null,
};

export default Legend;
