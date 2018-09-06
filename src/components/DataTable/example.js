import React from 'react';
import { map, max } from 'lodash';

import { Example } from '../../utils/example';
import Button from '../Button';

import DataTable from '.';

const data = [
  {
    name: 'Bob',
    email: 'a@weave.works',
  },
  {
    name: 'Albert',
    // Notice the emails are inverted to test sorting by this field
    email: 'b@weave.works',
  },
];

const nestedData = [
  {
    workloadId: 'default:deployment/myworkload',
    containers: [
      { name: 'nginx', behind: '4' },
      { name: 'redis', behind: '1' },
      { name: 'envoy', behind: '2' },
    ],
  },
  {
    workloadId: 'default:deployment/helloworld',
    containers: [{ name: 'helloworld', behind: '2' }],
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
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
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
            { value: 'workloadId', label: 'Workload' },
            { value: 'containers', label: 'Containers' },
            { value: 'behind', label: 'Behind' },
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
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
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
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
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
