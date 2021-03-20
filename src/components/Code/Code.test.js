import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { withTheme } from '../../utils/theme';

import { CopyNotice } from './Code';

import Code from '.';

const getSnapShot = cmp => renderer.create(withTheme(cmp)).toJSON();

document.execCommand = () => {};
document.getSelection = () => ({
  toString: () => '',
});

describe('<Code />', () => {
  it('should call onCopy when the button is clicked', () => {
    const onCopy = jest.fn();
    const wrapper = mount(
      withTheme(<Code onCopy={onCopy}>such code much programming</Code>)
    );
    expect(onCopy).not.toHaveBeenCalled();
    wrapper.find(CopyNotice).simulate('click');
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('should render correctly', () => {
    const snapshot = getSnapShot(<Code>such code much programming</Code>);
    expect(snapshot).toMatchSnapshot();
  });

  it('should render multi line string correctly with multiCommand=true', () => {
    const snapshot = getSnapShot(
      <Code multiCommand>
        {`
sudo curl -l git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
scope launch https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
          `}
      </Code>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('should render multi line function correctly with multiCommand=true', () => {
    const snapshot = getSnapShot(
      <Code multiCommand>
        {() => `
sudo curl -l git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
scope launch https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
      `}
      </Code>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('should render multi line jsx correctly with multiCommand=true', () => {
    const snapshot = getSnapShot(
      <Code multiCommand>
        <div>sudo curl -L git.io/scope -o /usr/local/bin/scope</div>
        <div>sudo chmod a+x /usr/local/bin/scope</div>
        <div>
          scope launch <wbr />
          https://yjsjsubdx1h8un1f858gp7to8d51zdre@frontend.dev.weave.works
        </div>
      </Code>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
