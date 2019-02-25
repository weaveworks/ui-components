import React from 'react';

import { Example, Info } from '../../utils/example';
import { Grid, GridRow as Row, GridColumn as Column } from '../Grid';
import Button from '../Button';

import Dropdown from '.';

const generateItems = (hash = '') => [
  {
    label: 'First Thing',
    value: `first-thing${hash}`,
  },
  {
    label: 'Second Thing',
    value: `second-thing${hash}`,
  },
  {
    label: 'Super long thing, this should get truncated',
    value: `third-thing${hash}`,
  },
];

const items = generateItems();

const groups = [
  [
    {
      label: 'A: First Thing',
      value: 'a-first',
    },
    {
      label: 'A: Second Thing',
      value: 'a-second',
    },
  ],
  [
    {
      label: 'B: First Thing',
      value: 'b-first',
    },
    {
      label: 'B: Second Thing',
      value: 'b-second',
    },
  ],
];

const divided = [
  {
    label: 'C: First Thing',
    value: 'c-first',
  },
  null,
  {
    label: 'D: First Thing',
    value: 'd-first',
  },
];

const DropdownButton = ({ onClick }) => (
  <Button onClick={onClick}>
    More actions <i className="fa fa-caret-down" />
  </Button>
);

const BiggerItem = ({ children, onClick }) => (
  <h1 onClick={onClick}>{children}</h1>
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
              <Dropdown
                items={[
                  ...generateItems('a'),
                  ...generateItems('b'),
                  ...generateItems('c'),
                  ...generateItems('d'),
                ]}
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
          <Column span={6}>
            <Example>
              <Info>Grouped items (passed as subarrays)</Info>
              <Dropdown
                items={groups}
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
        </Row>
        <Row>
          <Column span={6}>
            <Example>
              <Info>Grouped items (with null as dividers)</Info>
              <Dropdown
                items={divided}
                value={this.state.selected}
                onChange={this.handleChange}
              />
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
              <Info>
                With{' '}
                <code>
                  {'<Dropdown Components={{ ToggleView: Button }} />'}
                </code>
              </Info>
              <Dropdown
                Components={{ ToggleView: DropdownButton }}
                items={divided}
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
        </Row>
        <Row>
          <Column span={6}>
            <Example>
              <Info>
                With{' '}
                <code>
                  {'<Dropdown Components={{ ItemWrapper: BiggerItem }} />'}
                </code>
              </Info>
              <Dropdown
                Components={{ ItemWrapper: BiggerItem }}
                items={divided}
                value={this.state.selected}
                onChange={this.handleChange}
              />
            </Example>
          </Column>
        </Row>
        <div style={{ height: '70px' }} />
      </Grid>
    );
  }
}
