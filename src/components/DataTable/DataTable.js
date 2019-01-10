import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { map, orderBy, noop, get, first, partialRight } from 'lodash';
import { transparentize } from 'polished';

import { spacing } from '../../theme/selectors';

import Header from './_Header';

const borderColor = props => transparentize(0.6, props.theme.colors.purple100);

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  /* Any column that doesn't specify a width explicitly will share the */
  /* remaining horizontal space. */
  table-layout: fixed;

  td {
    padding: ${spacing('small')} ${spacing('xs')};
    vertical-align: top;
    border-left: 1px solid ${borderColor};
  }

  thead td {
    border: 0;
    font-weight: bold;
  }

  thead,
  tbody {
    border-bottom: 1px solid ${borderColor};

    > tr td:first-child {
      border-left: 0;
    }
  }

  ${props =>
    props.flush &&
    `
    tr td:first-child {
      padding-left: 0;
    }
  `};
`;

// Split this into a helper to keep the `doSort` method consistent with the initial state `sort`.
const sort = (data, key, order) => orderBy(data, key, [order]);

/**
 *  A sortable table for showing large data sets.
 *  ```javascript
 *
 *  const data = [
 *  {
 *    name: 'Bob',
 *    email: 'a@weave.works',
 *  },
 *  {
 *    name: 'Albert',
 *    email: 'b@weave.works',
 *  },
 * ];
 *
 *  React.render(
 *   <DataTable
 *    data={data}
 *    columns={[{ value: 'name', label: 'Name' }, { value: 'email', label: 'Email' }]}
 *   >
 *    {rows =>
 *      map(rows, r => (
 *        <tr key={r.email}>
 *          <td>{r.name}</td>
 *          <td>{r.email}</td>
 *        </tr>
 *      ))
 *    }
 *   </DataTable>
 * )
 * ```
 *
 * #### Nested table
 * ```javascript
 * const nesteData = [
 *   {
 *     workloadId: 'default:deployment/myworkload',
 *     containers: [
 *       { name: 'nginx', behind: '4' },
 *       { name: 'redis', behind: '1' },
 *       { name: 'envoy', behind: '2' },
 *     ],
 *   },
 *   {
 *     workloadId: 'default:deployment/helloworld',
 *     containers: [{ name: 'helloworld', behind: '2' }],
 *   },
 *  ];
 *
 *  <DataTable
 *   nested
 *   data={nesteData}
 *   sortBy="workloadId"
 *   sortOrder="asc"
 *   columns={[
 *     { value: 'workloadId', label: 'Workload' },
 *     { value: 'containers', label: 'Containers' },
 *     { value: 'behind', label: 'Behind' },
 *   ]}
 *   sortOverrides={{ behind: row => max(map(row.containers, c => c.behind)) }}
 * >
 *   {rows =>
 *     map(rows, r => (
 *       <tbody key={r.workloadId}>
 *         {map(r.containers, (c, i) => (
 *           <tr key={c.name}>
 *             {i === 0 && <td rowSpan={r.containers.length}>{r.workloadId}</td>}
 *             <td>{c.name}</td>
 *             <td>{c.behind}</td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     ))
 *   }
 * </DataTable>
 * ```
 *
 */
class DataTable extends React.PureComponent {
  state = {
    sortedData: sort(this.props.data, this.props.sortBy, this.props.sortOrder),
    sortField: this.props.sortBy || get(first(this.props.columns), 'value'),
    sortOrder: this.props.sortOrder,
  };

  componentDidMount() {
    this.doSort(
      this.state.sortedData,
      this.state.sortField,
      this.state.sortOrder
    );
  }

  componentWillReceiveProps(nextProps) {
    const { sortOrder, sortField } = this.state;
    let field = sortField;
    let order = sortOrder;

    if (nextProps !== this.props) {
      // Only translate if props have *actually* changed.
      if (
        nextProps.sortBy !== this.props.sortBy ||
        nextProps.sortOrder !== this.props.sortOrder
      ) {
        field = nextProps.sortBy;
        order = nextProps.sortOrder;
      }
      this.doSort(nextProps.data, field, order);
    }
  }

  doSort = (data, sortField, sortOrder = 'asc') => {
    const { sortOverrides } = this.props;

    this.setState({
      sortedData:
        // User overrides if specified, else do the default sort
        sortOverrides && sortOverrides[sortField]
          ? orderBy(
              data,
              partialRight(sortOverrides[sortField], sortOrder),
              sortOrder
            )
          : sort(data, sortField, sortOrder),
      sortField,
      sortOrder,
    });
  };

  handleHeaderClick = (ev, columnValue) => {
    let order;
    let field = this.state.sortField;
    const column = this.props.columns.find(c => c.value === columnValue);

    const isCurrentColumn = columnValue === this.state.sortField;
    if (isCurrentColumn) {
      // If we are already sorting by this column, change the order.
      order = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Else, order by the new column, ascending
      order = column.initialSortOrder || 'asc';
      field = columnValue;
    }

    this.doSort(this.state.sortedData, field, order);
    this.props.onSort(field, order);
  };

  render() {
    const {
      className,
      children,
      columns,
      nested,
      extraHeaders,
      flush,
    } = this.props;
    const { sortedData, sortOrder, sortField } = this.state;

    return (
      <Table className={className} flush={flush}>
        <thead>
          <tr>
            {map(columns, ({ value, label, sortable, width, element }) => (
              <Header
                sortable={sortable}
                order={sortField === value ? sortOrder : null}
                value={value}
                onClick={this.handleHeaderClick}
                key={value}
                width={width}
                title={label}
              >
                {element || label}
              </Header>
            ))}
            {map(extraHeaders, (h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        {/* Don't render the tbody if nested; nested tables use <tbody> for rows */}
        {nested ? children(sortedData) : <tbody>{children(sortedData)}</tbody>}
      </Table>
    );
  }
}

const columnPropType = PropTypes.shape({
  element: PropTypes.element,
  initialSortOrder: PropTypes.oneOf(['asc', 'desc']),
  label: PropTypes.string,
  sortable: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
});

DataTable.propTypes = {
  /**
   * A render-prop function that will be passed the sorted rows for the table.
   */
  children: PropTypes.func.isRequired,
  /**
   * An array of objects that will be used as columns.
   * `value` must map to a key in your data in order for sorting to work.
   * If an `element` key is specified, that element will be used instead of `label`.
   */
  columns: PropTypes.arrayOf(columnPropType).isRequired,
  /**
   * The rows that will be sorted by clicking on the headers.
   * There must be a key in your row object that matches the column `value`.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Extra elements that will be added to the table headers.
   * These columns will NOT be sortable.
   */
  extraHeaders: PropTypes.arrayOf(PropTypes.element),
  /**
   * Flush will align the first column with the edge of the table, instead of
   * having left padding
   */
  flush: PropTypes.bool,
  /**
   * If true, a wrapping `<tbody />` element will NOT be rendered.
   * All child rows of `nested` tables should be <tbody /> tags
   */
  nested: PropTypes.bool,
  /**
   * Optional callback triggered when a header is clicked.
   */
  onSort: PropTypes.func,
  /**
   * The value by which to sort the rows passed to the `data` prop.
   */
  sortBy: PropTypes.string,
  /**
   * Whether to sort by 'asc' or 'desc' on initial load.
   * Modifying this prop will override the user's currently selected sort order.
   */
  sortOrder: PropTypes.oneOf(['asc', 'desc']),
  /**
   * A map of customer sorting functions that will be used when a column is sorted.
   * They keys of this object should match the colum `values` that to which you wish to
   * provide customer sorting logic.
   *
   */
  sortOverrides: PropTypes.object,
};

DataTable.defaultProps = {
  extraHeaders: [],
  flush: false,
  nested: false,
  onSort: noop,
  sortBy: '',
  sortOrder: 'asc',
  sortOverrides: {},
};

export default DataTable;
