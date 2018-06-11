import React from 'react';

import { Example, Info } from '../../utils/example';
import TabSelect from './TabSelect';
import Tab from './Tab';

export default function TabSelectExample() {
  return (
    <div>
      <Example>
        <Info>Default</Info>
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
      <Info>Secondary</Info>
      <Example>
        <TabSelect secondary>
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
    </div>
  );
}
