import React from 'react';

import Button from '.';

export default function MatchedTextExample() {
  const onClick = () => console.log('clickity clack');
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
