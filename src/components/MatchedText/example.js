import React from 'react';

import { MatchedText } from '.';

export default function MatchedTextExample() {
  return (
    <ul>
      <li>
        <MatchedText text="no `match` prop on this MatchedText" />
      </li>
      <li>
        <MatchedText text="empty `match` object ({}) on this MatchedText" match={{}} />
      </li>
      <li>
        <MatchedText text="hey its a match!" match={{start: 10, length: 5}} />
      </li>
    </ul>
  );
}
