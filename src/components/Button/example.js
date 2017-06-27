import React from 'react';

import Button from '.';

export default function ButtonExample({ clickHandler }) {
  const onClick = (ev, text) => clickHandler('onClick', text);
  return (
    <div>
      <p><Button onClick={onClick} text="Submit" /></p>
      <p><Button disabled onClick={onClick} text="Disabled" /></p>
      <p><Button primary onClick={onClick} text="Primary" /></p>
      <p><Button selected onClick={onClick} text="Selected" /></p>
      <p><Button danger onClick={onClick} text="Danger" /></p>
    </div>
  );
}
