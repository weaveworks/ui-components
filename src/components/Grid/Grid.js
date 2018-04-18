import React from 'react';
import styled from 'styled-components';

const GridWrapper = styled.div`
  max-width: 100%;
`;

/**
 * A grid for building layouts.
 *
 * Use the `<GridColumn />` component to specify a col-span.
 * The max number of columns is 12, so a col-span of 12 will span 100% of the available width.
 *
 * ```javascript
 * import {Grid, GridColumn, GridRow} from 'weave-ui';
 *
 * export default function MyGrid() {
 *  return (
 *   <Grid>
 *      <GridRow>
 *        <GridColumn span={4}>
 *          <p>First Col</p>
 *          Lorem ipsum dolor ....
 *        </GridColumn>
 *        <GridColumn span={8}>
 *          <p>Second Col</p>
 *          Lorem ipsum dolor ...
 *        </GridColumn>
 *     </GridRow>
 *   </Grid>
 * )}
 * ```
 *
 * See also:
 * [GridColumn](/components/gridcolumn)
 */
export default function Grid({children}) {
  return (
    <GridWrapper className="weave-grid">{children}</GridWrapper>
  );
}
