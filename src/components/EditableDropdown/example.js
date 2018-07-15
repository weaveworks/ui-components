import React from 'react';

import { Example, Info } from '../../utils/example';
import { Grid, GridRow as Row, GridColumn as Column } from '../Grid';

import EditableDropdown from '.';

const items = [
  {
    value: 'first-thing',
    label: 'First Thing',
  },
  {
    value: 'second-thing',
    label: 'Second Thing',
  },
  {
    value: 'third-thing',
    label: 'Super long thing, this should get truncated',
  },
];

const groups = [
  [
    {
      value: 'a-first',
      label: 'A: First Thing',
    },
    {
      value: 'a-second',
      label: 'A: Second Thing',
    },
  ],
  [
    {
      value: 'b-first',
      label: 'B: First Thing',
    },
    {
      value: 'b-second',
      label: 'B: Second Thing',
    },
  ],
];

const divided = [
  {
    value: 'c-first',
    label: 'C: First Thing',
  },
  null,
  {
    value: 'd-first',
    label: 'D: First Thing',
  },
];

export default class EditableDropdownExample extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: null,
    };
  }

  handleChange = (ev, value) => {
    this.setState(() => ({ selected: value }));
  };

  render() {
    return (
      <Grid>
        <Row>
          <Column span={6}>
            <Example>
              <Info>Default dropdown</Info>
              <EditableDropdown items={items} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
          <Column span={6}>
            <Example>
              <Info>Grouped items (passed as subarrays)</Info>
              <EditableDropdown items={groups} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
        </Row>
        <Row>
          <Column span={6}>
            <Example>
              <Info>Grouped items (with null as dividers)</Info>
              <EditableDropdown items={divided} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
          <Column span={6}>
            <Example>
              <Info>With placeholder</Info>
              <EditableDropdown
                items={items}
                placeholder="Select an item"
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
        </Row>
      </Grid>
    );
  }
}
