import React from 'react';
import styled from 'styled-components';

const Legend = styled.div``;

const LegendItems = styled.div`
  color: ${props => props.theme.colors.neutral.black};
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
  font-size: 13px;
  align-items: center;
  padding: 3px 17px 3px 8px;
  border-radius: 4px;
  max-width: 45%;

  &:hover {
    background-color: ${props => props.theme.colors.athens};
  }

  ${props => props.selected && `
    background-color: ${props.theme.colors.athens};
  `};
`;

const LegendItemName = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const LegendToggle = styled.span`
  color: ${props => props.theme.colors.lavender};
  cursor: pointer;
  display: block;
  padding: 5px;
  font-size: 15px;
  width: fit-content;
`;

const LegendCaret = styled.span`
  margin-left: 5px;
`;

const ColorBox = styled.span`
  background-color: ${props => props.color};
  border-radius: 1px;
  margin-right: 4px;
  min-width: 13px;
  height: 5px;
`;

class GraphLegend extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      legendShown: props.legendShown,
      selectedLegendSeriesKey: null,
      hoveredLegendSeriesKey: null,
      multiSeries: [],
    };

    this.handleLegendToggle = this.handleLegendToggle.bind(this);
  }

  handleLegendItemClick(series) {
    if (this.state.selectedLegendSeriesKey === series.key) {
      this.setState({ selectedLegendSeriesKey: null });
      this.props.onSelectedLegendSeriesChange(null);
    } else {
      this.setState({ selectedLegendSeriesKey: series.key });
      this.props.onSelectedLegendSeriesChange(series.key);
    }
  }

  handleLegendItemMouseEnter(series) {
    this.setState({ hoveredLegendSeriesKey: series.key });
    this.props.onHoveredLegendSeriesChange(series.key);
  }

  handleLegendItemMouseLeave() {
    this.setState({ hoveredLegendSeriesKey: null });
    this.props.onHoveredLegendSeriesChange(null);
  }

  handleLegendToggle() {
    this.setState({ legendShown: !this.state.legendShown });
  }

  render() {
    const caretIcon = this.state.legendShown ? 'fa-caret-down' : 'fa-caret-right';

    return (
      <Legend>
        {this.props.legendCollapsable && (
          <LegendToggle onClick={this.handleLegendToggle}>
            Legend <LegendCaret className={`fa ${caretIcon}`} />
          </LegendToggle>
        )}
        {this.state.legendShown && (
          <LegendItems>
            {this.props.multiSeries.map(series => (
              <LegendItem
                key={series.key}
                title={series.name}
                onClick={() => this.handleLegendItemClick(series)}
                onMouseEnter={() => this.handleLegendItemMouseEnter(series)}
                onMouseLeave={() => this.handleLegendItemMouseLeave()}
                selected={this.state.selectedLegendSeriesKey === series.key}
              >
                <ColorBox color={series.color} />
                <LegendItemName>{series.name}</LegendItemName>
              </LegendItem>
            ))}
          </LegendItems>
        )}
      </Legend>
    );
  }
}

GraphLegend.defaultProps = {
  multiSeries: [],
  legendCollapsable: false,
  legendShown: true,
};

export default GraphLegend;
