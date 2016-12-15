import React from 'react';

import WeaveCloudLogo from '.';

export default function WeaveCloudLogoExample() {
  return (
    <div>
      <p>Dark Logo</p>
      <div>
        <WeaveCloudLogo theme="dark" />
      </div>
      <p>Light Logo</p>
      <div style={{backgroundColor: 'black'}}>
        <WeaveCloudLogo theme="light" />
      </div>
    </div>
  );
}
