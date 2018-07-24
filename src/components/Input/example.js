import React from 'react';
import styled from 'styled-components';

import { Example, Info } from '../../utils/example';

import Input from '.';

const onChange = () => null;

const StyledExample = styled(Example)`
  width: 250px;
`;

export default function InputExample() {
  return (
    <div>
      <StyledExample>
        <Info>Plain inputs</Info>
        <Input
          label="Username"
          placeholder="your name here"
          onChange={onChange}
        />
        <Input label="Email" value="ron@hogwarts.edu" onChange={onChange} />
      </StyledExample>
      <StyledExample>
        <Info>With validation</Info>
        <Input
          label="Email"
          value="invalid-email-that is really long"
          valid={false}
          message="Bro, do you even email?"
          onChange={onChange}
        />
        <Input label="Password" type="password" onChange={onChange} />
      </StyledExample>
    </div>
  );
}
