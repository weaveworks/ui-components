import React from 'react';

import { Example } from '../../utils/example';

import Button from '.';

export default function ButtonExample({ clickHandler }) {
  const onClick = (ev, text) => clickHandler('onClick', text);
  return (
    <div>
      <Example>
        <Button onClick={onClick} text="Submit" />
      </Example>
      <Example>
        <Button
          disabled
          onClick={onClick}
          title="Can't click this right now..."
          text="Disabled"
        />
      </Example>
      <Example>
        <Button primary onClick={onClick} text="Primary" />
      </Example>
      <Example>
        <Button selected onClick={onClick} text="Selected" />
      </Example>
      <Example>
        <Button danger onClick={onClick} text="Danger" />
      </Example>
    </div>
  );
}
