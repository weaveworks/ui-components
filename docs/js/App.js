import React from 'react';
import Logo from '../../src/components/WeaveWorksLogo';

export default function LandingPage({children}) {
  return (
    <div className="app">
      <div className="header"><a href="http://weave.works"><Logo /></a></div>
      {children}
    </div>
  );
}
