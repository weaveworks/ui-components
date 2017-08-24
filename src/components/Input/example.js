import React from 'react';

import Input from '.';

export default function InputExample() {
  return (
    <div>
      <div>
        <Input label="Username" placeholder="your name here" />
        <Input label="Email" value="ron@hogwarts.edu" />
      </div>
      <div>
        <Input
          label="Email"
          value="invalid-email"
          valid={false}
          message="Bro, do you even email?"
        />
        <Input label="Password" type="password" />
      </div>
    </div>
  );
}
