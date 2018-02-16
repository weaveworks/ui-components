import React from 'react';

import { Example, Info } from '../../utils/example';
import WeaveCloudLogo from '.';

export default function WeaveCloudLogoExample() {
  return (
    <div>
      <Example>
        <Info>Dark Logo</Info>
        <WeaveCloudLogo theme="dark" />
      </Example>
      <Example>
        <Info>Light Logo</Info>
        <div style={{ backgroundColor: 'black' }}>
          <WeaveCloudLogo theme="light" />
        </div>
        <br />
        <Info>Tiny Logo</Info>
        <div>
          <WeaveCloudLogo theme="dark" tiny />
        </div>
        <br />
        <Info>Tiny Logo, light theme</Info>
        <div style={{ backgroundColor: 'black'}}>
          <WeaveCloudLogo theme="light" tiny />
        </div>
      </Example>
    </div>
  );
}
