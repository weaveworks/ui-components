import React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';

import { withTheme } from '../../utils/theme';

import Input from './Input';

describe('<Input />', () => {
  let props;
  let wrapper;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();

    props = {
      label: 'Hi',
      valid: false,
      message: 'Doh!',
      onChange,
    };

    wrapper = mount(withTheme(<Input {...props} />));
  });

  it('should call onChange on input', () => {
    expect(onChange).not.toHaveBeenCalled();

    wrapper.find('input').simulate('change');

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not render validation message when valid=true', () => {
    props = {
      valid: true,
      message: 'Derp!',
    };
    wrapper = mount(withTheme(<Input {...props} />), {
      lifecycleExperimental: true,
    });

    expect(wrapper.find('Input__ValidationMessage')).toHaveStyleRule(
      'visibility',
      'hidden'
    );
  });

  it('should render validation message when valid=false', () => {
    props = {
      valid: false,
      message: 'Derp!',
    };
    wrapper = mount(withTheme(<Input {...props} />));

    expect(wrapper.find('Input__ValidationMessage')).toHaveStyleRule(
      'visibility',
      'visible'
    );
  });

  it('should remove validation message from the DOM when hideValidationMessage=true', () => {
    props = {
      hideValidationMessage: true,
    };
    wrapper = mount(withTheme(<Input {...props} />));

    expect(wrapper.find('Input__ValidationMessage')).toHaveStyleRule(
      'display',
      'none'
    );
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
