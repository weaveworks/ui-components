import React from 'react';

export default function GridColumn({children, span}) {
  return (
    <div className={`weave-grid-column col-span-${span}`}>
      {children}
    </div>
  );
}
