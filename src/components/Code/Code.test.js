import React from 'react';
import { shallow, mount } from 'enzyme';

import { withTheme } from '../../utils/theme';

import { CopyNotice } from './Code';

import Code from '.';

document.execCommand = () => {};
document.getSelection = () => ({
  toString: () => '',
});

describe('<Code />', () => {
  let props;
  let wrapper;
  let onCopy;

  beforeEach(() => {
    onCopy = jest.fn();
    props = {
      onCopy,
    };
    wrapper = shallow(
      <Code {...props}>such code much programming</Code>,
      withTheme
    );
  });

  it('should call onCopy when the button is clicked', () => {
    wrapper = mount(
      withTheme(<Code {...props}>such code much programming</Code>)
    );
    expect(onCopy).not.toHaveBeenCalled();
    wrapper.find(CopyNotice).simulate('click');
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('should render correctly', () => {
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render multi line string correctly with multiCommand=true', () => {
    wrapper = shallow(
      <Code multiCommand>
        {`
sudo curl -l git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
scope launch https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
          `}
      </Code>,
      withTheme
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render multi line function correctly with multiCommand=true', () => {
    wrapper = shallow(
      <Code multiCommand>
        {() => `
sudo curl -l git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
scope launch https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
      `}
      </Code>,
      withTheme
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render multi line jsx correctly with multiCommand=true', () => {
    wrapper = shallow(
      <Code multiCommand>
        <div>sudo curl -L git.io/scope -o /usr/local/bin/scope</div>
        <div>sudo chmod a+x /usr/local/bin/scope</div>
        <div>
          scope launch <wbr />
          https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
        </div>
      </Code>,
      withTheme
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
