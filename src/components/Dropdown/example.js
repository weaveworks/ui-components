import React from 'react';

import { Example, Info } from '../../utils/example';
import { Grid, GridRow as Row, GridColumn as Column } from '../Grid';
import Button from '../Button';

import Dropdown from '.';

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

const DropdownButton = ({ onClick }) => (
  <Button onClick={onClick}>More actions <i className="fa fa-caret-down" /></Button>
);

export default class DropdownExample extends React.Component {
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
              <Dropdown items={items} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
          <Column span={6}>
            <Example>
              <Info>Grouped items (passed as subarrays)</Info>
              <Dropdown items={groups} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
        </Row>
        <Row>
          <Column span={6}>
            <Example>
              <Info>Grouped items (with null as dividers)</Info>
              <Dropdown items={divided} value={this.state.selected} onChange={this.handleChange} />
            </Example>
          </Column>
          <Column span={6}>
            <Example>
              <Info>With placeholder</Info>
              <Dropdown
                items={items}
                placeholder="Select an item"
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
        </Row>
        <Row>
          <Column span={6}>
            <Example>
              <Info>With <code>Button</code> component</Info>
              <Dropdown
                withComponent={DropdownButton}
                items={divided}
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
