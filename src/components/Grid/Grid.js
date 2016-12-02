import React from 'react';

/**
 * A responsive grid.
 *
 * Use the `<GridColumn />` component to specify a col-span.
 * The max number of columns is 12, so a col-span of 12 will span 100% of the available width.
 *
 * ```javascript
 * import {Grid, GridColumn} from 'weave-ui';
 *
 * export default function MyGrid() {
 *  return (
 *     <Grid>
 *      <GridColumn span={4}>
 *        <p>First Col</p>
 *        Lorem ipsum dolor ....
 *      </GridColumn>
 *      <GridColumn span={8}>
 *        <p>Second Col</p>
 *        Lorem ipsum dolor ...
 *      </GridColumn>
 *     </Grid>
 * )}
 * ```
 *
 * See also:
 * [GridColumn](/components/gridcolumn)
 */
export default function Grid({children}) {
  return (
    <div className="weave-grid">{children}</div>
  );
}
