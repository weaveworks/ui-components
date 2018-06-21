import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { withTheme } from '../../utils/theme';
import Code from '.';

enzyme.configure({ adapter: new Adapter() });

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
      withTheme(<Code {...props}>such code much programming</Code>)
    );
  });

  it('should call onCopy when the button is clicked', () => {
    wrapper = mount(
      withTheme(<Code {...props}>such code much programming</Code>)
    );
    expect(onCopy).not.toHaveBeenCalled();
    wrapper.find('Code__CopyNotice').simulate('click');
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('should render correctly', () => {
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
