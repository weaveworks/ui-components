import React from 'react';

import { Example, Info } from '../../utils/example';
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

export default class DropdownExample extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: items[0].value,
    };
  }

  render() {
    const onChange = (ev, value) => {
      this.setState(() => ({ selected: value }));
    };

    return (
      <div>
        <Example>
          <Info>Default dropdown</Info>
          <Dropdown items={items} value={this.state.selected} onChange={onChange} />
        </Example>
        <Example>
          <Info>Grouped items (passed as subarrays)</Info>
          <Dropdown items={groups} value={this.state.selected} onChange={onChange} />
        </Example>
        <Example>
          <Info>Grouped items (with null as dividers)</Info>
          <Dropdown items={divided} value={this.state.selected} onChange={onChange} />
        </Example>
      </div>
    );
  }
}
