import React from 'react';
import styled from 'styled-components';
import { range } from 'lodash';

import { DataTable, SparkTimeline } from '../components';

export default {
  title: 'Example/SparkTimeline',
  component: SparkTimeline,
  argTypes: {
    data: 'data',
  },
};

const Template = args => <SparkTimeline {...args} />;

const Container = styled.div`
  font-family: sans-serif;
`;

const SparklineCell = styled.td`
  && {
    padding: 0 16px;
  }
`;

const DataTableRow = args => (
  <Container>
    <DataTable
      data={args.data.map((d, i) => ({
        name: `App dev ${i}`,
        data: d,
        version: 'v1.18.3',
      }))}
      columns={[
        { value: 'name', label: 'Name' },
        { value: 'activity', label: 'Activity' },
        { value: 'version', label: 'Version' },
      ]}
    >
      {rows =>
        rows.map((r, i) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <SparklineCell>
              <SparkTimeline {...args} data={r.data} />
            </SparklineCell>
            <td>{r.version}</td>
          </tr>
        ))
      }
    </DataTable>
  </Container>
);

export const Empty = Template.bind({});
Empty.args = {
  data: [],
};

export const Basic = Template.bind({});
Basic.args = {
  data: [{ ts: 4, n: 1 }, { ts: 6, n: 2 }],
};

export const InDataTableRow = DataTableRow.bind({});
InDataTableRow.args = {
  data: [
    [{ ts: 4 }, { ts: 4, status: 'success' }, { ts: 6, status: 'success' }],
    [{ ts: 5 }, { ts: 12, status: 'success' }],
    [{ ts: 25 }],
    [],
    range(24).map(n => ({
      ts: n,
    })),
    range(25).flatMap(n => [
      {
        ts: n,
      },
      {
        ts: n,
      },
    ]),
  ],
};
