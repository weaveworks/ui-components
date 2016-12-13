import React from 'react';

/**
 * A menu component that can be used for navigation.
 *
 * ```javascript
 * export default function MenuExample({clickHandler}) {
 *   return (
 *     <Menu>
 *       <MenuItem onClick={clickHandler.bind(this, 'onClick')} text="Item 1" />
 *       <MenuItem onClick={clickHandler.bind(this, 'onClick')} text="Item 2" />
 *       <MenuItem
 *         onClick={clickHandler.bind(this, 'onClick')}
 *         className="weave-menu-sub-item" text="Sub Item 1"
 *       />
 *       <MenuItem
 *         onClick={clickHandler.bind(this, 'onClick')}
 *         className="weave-menu-sub-item" text="Sub Item 2"
 *       />
 *     </Menu>
 *   );
 * }
 * ```
 */
export default function Menu({children}) {
  return (
    <div className="weave-menu">{children}</div>
  );
}
