import React from 'react';

import Button from '.';

export default function ButtonExample({ clickHandler }) {
  const onClick = () => clickHandler('onClick', 'Button clicked!');
  return (
    <div>
      <p><Button onClick={onClick} text="Submit" /></p>
      <p><Button disabled onClick={onClick} text="Disabled" /></p>
      <p><Button primary onClick={onClick} text="Primary" /></p>
    </div>
  );
}
