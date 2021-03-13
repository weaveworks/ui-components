import React from 'react';

import { DataTable, SparkTimeline } from '../components';

export default {
  title: 'Example/SparkTimeline',
  component: SparkTimeline,
  argTypes: {
    data: 'data',
  },
};

const Template = args => <SparkTimeline {...args} />;

const DataTableRow = args => (
  <DataTable
    data={[{ name: 'App dev', version: 'v1.18' }]}
    columns={[
      { value: 'name', label: 'Name' },
      { value: 'activity', label: 'Activity' },
      { value: 'version', label: 'Version' },
    ]}
  >
    {rows =>
      rows.map(r => (
        <tr key={r.name}>
          <td>{r.name}</td>
          <td>
            <SparkTimeline {...args} />
          </td>
          <td>{r.version}</td>
        </tr>
      ))
    }
  </DataTable>
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
  data: [{ ts: 4, n: 1 }, { ts: 6, n: 2 }],
};
