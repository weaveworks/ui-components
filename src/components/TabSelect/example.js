import React from 'react';

import { Example } from '../../utils/example';
import TabSelect from './TabSelect';
import Tab from './Tab';

export default function TabSelectExample() {
  return (
    <Example>
      <TabSelect>
        <Tab label="A" name="a">
          Tab A
        </Tab>
        <Tab label="B" name="b">
          Tab B
        </Tab>
        <Tab label="C" name="c">
          Tab C
        </Tab>
      </TabSelect>
    </Example>
  );
}
