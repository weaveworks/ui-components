import React from 'react';

import Input from '.';


const onChange = () => null;

export default function InputExample() {
  return (
    <div>
      <div>
        <Input label="Username" placeholder="your name here" onChange={onChange} />
        <Input label="Email" value="ron@hogwarts.edu" onChange={onChange} />
      </div>
      <div>
        <Input
          label="Email"
          value="invalid-email"
          valid={false}
          message="Bro, do you even email?"
          onChange={onChange}
        />
        <Input label="Password" type="password" onChange={onChange} />
      </div>
    </div>
  );
}
