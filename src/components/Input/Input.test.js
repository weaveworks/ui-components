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
      message: 'Doh!',
      onChange,
      valid: false,
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
      message: 'Derp!',
      valid: true,
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
      message: 'Derp!',
      valid: false,
    };
    wrapper = mount(withTheme(<Input {...props} />));

    expect(wrapper.find('Input__ValidationMessage')).toHaveStyleRule(
      'visibility',
      'visible'
    );
  });

  it('should only render <label> if label prop is provided', () => {
    props = {
      message: 'Derp!',
      valid: false,
    };
    wrapper = mount(withTheme(<Input {...props} />));

    expect(wrapper.find('label').length).toBe(0);

    wrapper = mount(
      withTheme(<Input {...{ ...props, label: 'Woohoo, label time!' }} />)
    );

    expect(wrapper.find('label').length).toBe(1);
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
