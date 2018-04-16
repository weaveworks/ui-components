import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { without } from 'lodash';


const LegendContainer = styled.div`
  opacity: ${props => (props.loading ? 0.35 : 1)};
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
  font-size: 13px;
  align-items: center;
  padding: 2px 16px 2px 7px;
  margin-right: 2px;
  margin-bottom: 2px;
  border-radius: 4px;

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
  max-width: 36ch;
`;

const LegendToggle = styled.span`
  color: ${props => props.theme.colors.primary.lavender};
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

class Legend extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      shown: props.shown,
      hoveredKey: null,
      selectedKeys: [],
      multiSeries: [],
    };
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
      const onlyThisSelected = this.seriesSelected(series) && selectedKeys.length === 1;
      selectedKeys = onlyThisSelected ? [] : [series.key];
    }

    this.setState({ selectedKeys });
    this.props.onSelectedMultiSeriesChange(selectedKeys);
  }

  handleLegendItemMouseEnter = (series) => {
    this.setState({ hoveredKey: series.key });
    this.props.onHoveredSeriesChange(series.key);
  }

  handleLegendItemMouseLeave = () => {
    this.setState({ hoveredKey: null });
    this.props.onHoveredSeriesChange(null);
  }

  handleLegendToggle = () => {
    this.setState({ shown: !this.state.shown });
  }

  seriesSelected = series => (
    this.state.selectedKeys.includes(series.key)
  )

  render() {
    const caretIcon = this.state.shown ? 'fa-caret-down' : 'fa-caret-right';

    return (
      <LegendContainer loading={this.props.loading}>
        {this.props.collapsable && (
          <LegendToggle onClick={this.handleLegendToggle}>
            Legend <LegendCaret className={`fa ${caretIcon}`} />
          </LegendToggle>
        )}
        {this.state.shown && (
          <LegendItems>
            {this.props.multiSeries.map(series => (
              <LegendItem
                key={series.key}
                title={series.name}
                onClick={ev => this.handleLegendItemClick(ev, series)}
                onMouseEnter={() => this.handleLegendItemMouseEnter(series)}
                onMouseLeave={() => this.handleLegendItemMouseLeave()}
                selected={this.seriesSelected(series)}
              >
                <ColorBox color={series.color} />
                <LegendItemName>{series.name}</LegendItemName>
              </LegendItem>
            ))}
          </LegendItems>
        )}
      </LegendContainer>
    );
  }
}

Legend.propTypes = {
  multiSeries: PropTypes.array.isRequired,
  onSelectedMultiSeriesChange: PropTypes.func.isRequired,
  onHoveredSeriesChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  collapsable: PropTypes.bool.isRequired,
  shown: PropTypes.bool.isRequired,
};

export default Legend;
