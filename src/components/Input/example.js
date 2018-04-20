import React from 'react';

import { Example, Info } from '../../utils/example';
import Input from '.';

const onChange = () => null;

export default function InputExample() {
  return (
    <div>
      <Example>
        <Info>Plain inputs</Info>
        <Input
          label="Username"
          placeholder="your name here"
          onChange={onChange}
        />
        <Input label="Email" value="ron@hogwarts.edu" onChange={onChange} />
      </Example>
      <Example>
        <Info>With validation</Info>
        <Input
          label="Email"
          value="invalid-email"
          valid={false}
          message="Bro, do you even email?"
          onChange={onChange}
        />
        <Input label="Password" type="password" onChange={onChange} />
      </Example>
    </div>
  );
}
