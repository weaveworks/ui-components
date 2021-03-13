import React from 'react';

import Button from '../components/Button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {},
};

const handleClick = () => {
  console.log('Clicked');
};

const Template = args => <Button {...args} onClick={handleClick} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  text: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Button',
};

export const Danger = Template.bind({});
Danger.args = {
  danger: true,
  text: 'Button',
};

export const Selected = Template.bind({});
Selected.args = {
  selected: true,
  text: 'Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  text: 'Button',
};
