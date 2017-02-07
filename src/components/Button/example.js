import React from 'react';

import Button from '.';

export default function ButtonExample({ clickHandler }) {
  const onClick = () => clickHandler('onClick', 'Button clicked!');
  return (
    <ul>
      <li>
        <Button onClick={onClick} />
      </li>
      <li>
        <Button disabled onClick={onClick} />
      </li>
    </ul>
  );
}
