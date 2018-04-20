import React from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  color: ${props => props.theme.colors.primary.lavender};
  text-align: left;
`;

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
 *         isSubItem text="Sub Item 1"
 *       />
 *       <MenuItem
 *         onClick={clickHandler.bind(this, 'onClick')}
 *         isSubItem text="Sub Item 2"
 *       />
 *     </Menu>
 *   );
 * }
 * ```
 */
export default function Menu({ children }) {
  return <MenuWrapper className="weave-menu">{children}</MenuWrapper>;
}
