import React from 'react';

import { Example } from '../../utils/example';
import MatchedText from '.';

export default function MatchedTextExample() {
  return (
    <div>
      <Example>
        <MatchedText text="no `match` prop on this MatchedText" />
      </Example>
      <Example>
        <MatchedText text="empty `match` object ({}) on this MatchedText" match={{}} />
      </Example>
      <Example>
        <MatchedText text="hey its a match!" match={{start: 10, length: 5}} />
      </Example>
    </div>
  );
}
