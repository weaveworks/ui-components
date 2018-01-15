import React from 'react';

import { Example } from '../../utils/example';
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
          <Dropdown items={items} value={this.state.selected} onChange={onChange} />
        </Example>
      </div>
    );
  }
}
