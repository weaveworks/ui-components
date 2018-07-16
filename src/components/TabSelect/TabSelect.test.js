import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import 'jest-styled-components';
import { withTheme } from '../../utils/theme';

import TabSelect from './TabSelect';
import Tab from './Tab';
import TabButton from './_TabButton';

describe('<Tab Select />', () => {
  describe('snapshots', () => {
    it('renders', () => {
      const tree = renderer
        .create(
          withTheme(
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
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders with a selectedTab', () => {
      const tree = renderer
        .create(
          withTheme(
            <TabSelect selectedTab="b">
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
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  it('changes tabs on click', () => {
    const tabs = mount(
      withTheme(
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
      )
    );

    tabs
      .find(TabButton)
      .at(1)
      .simulate('click');
    expect(tabs.find(Tab).text()).toEqual('Tab B');
  });
});
