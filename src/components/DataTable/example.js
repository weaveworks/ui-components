import React from 'react';
import { map, max } from 'lodash';

import { Example } from '../../utils/example';
import Button from '../Button';

import DataTable from '.';

const data = [
  {
    email: 'a@weave.works',
    name: 'Bob',
  },
  {
    // Notice the emails are inverted to test sorting by this field
    email: 'b@weave.works',
    name: 'Albert',
  },
];

const nestedData = [
  {
    containers: [
      { behind: '4', name: 'nginx' },
      { behind: '1', name: 'redis' },
      { behind: '2', name: 'envoy' },
    ],
    workloadId: 'default:deployment/myworkload',
  },
  {
    containers: [{ behind: '2', name: 'helloworld' }],
    workloadId: 'default:deployment/helloworld',
  },
];

export default function DataTableExample() {
  return (
    <div>
      <Example>
        <h3>Default Table</h3>
        <DataTable
          data={data}
          columns={[
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
          ]}
        >
          {rows =>
            map(rows, r => (
              <tr key={r.email}>
                <td>{r.name}</td>
                <td>{r.email}</td>
              </tr>
            ))
          }
        </DataTable>
      </Example>
      <Example>
        <h3>Nested Table</h3>
        <DataTable
          nested
          data={nestedData}
          sortBy="workloadId"
          sortOrder="asc"
          columns={[
            { label: 'Workload', value: 'workloadId' },
            { label: 'Containers', value: 'containers' },
            { label: 'Behind', value: 'behind' },
          ]}
          sortOverrides={{
            behind: row => max(map(row.containers, c => c.behind)),
          }}
        >
          {rows =>
            map(rows, r => (
              <tbody key={r.workloadId}>
                {map(r.containers, (c, i) => (
                  <tr key={c.name}>
                    {i === 0 && (
                      <td rowSpan={r.containers.length}>{r.workloadId}</td>
                    )}
                    <td>{c.name}</td>
                    <td>{c.behind}</td>
                  </tr>
                ))}
              </tbody>
            ))
          }
        </DataTable>
      </Example>
      <Example>
        <h3>With extra headers</h3>
        <DataTable
          data={data}
          columns={[
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
          ]}
          extraHeaders={[<Button>Extra Header</Button>]}
        >
          {rows =>
            map(rows, r => (
              <tr key={r.email}>
                <td>{r.name}</td>
                <td>{r.email}</td>
              </tr>
            ))
          }
        </DataTable>
      </Example>
      <Example>
        <h3>Flush Table</h3>
        <DataTable
          data={data}
          flush
          columns={[
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
          ]}
        >
          {rows =>
            map(rows, r => (
              <tr key={r.email}>
                <td>{r.name}</td>
                <td>{r.email}</td>
              </tr>
            ))
          }
        </DataTable>
      </Example>
    </div>
  );
}
