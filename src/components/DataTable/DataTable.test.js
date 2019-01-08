import React from 'react';
import { mount } from 'enzyme';
import { map } from 'lodash';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import { withTheme } from '../../utils/theme';

import DataTable from '.';

const getFirstRowName = table =>
  table
    .find('tbody tr')
    .first()
    .find('td')
    .first()
    .text();

describe('DataTable', () => {
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
    {
      email: 'c@weave.works',
      name: 'Ty',
    },
  ];

  describe('snapshots', () => {
    it('renders rows', () => {
      const tree = renderer
        .create(
          withTheme(
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('sorts rows by a field', () => {
      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={data}
              sortBy="email"
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
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('sorts fields by a give order', () => {
      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={data}
              sortBy="email"
              sortOrder="desc"
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('renders nested rows', () => {
      const nesteData = [
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

      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={nesteData}
              sortBy="workloadId"
              sortOrder="asc"
              columns={[
                { label: 'Workload', value: 'workloadId' },
                { label: 'Containers', value: 'containers' },
                { label: 'Behind', value: 'behind' },
              ]}
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('renders extra headers', () => {
      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={data}
              columns={[
                { label: 'Name', value: 'name' },
                { label: 'Email', value: 'email' },
              ]}
              extraHeaders={[
                <div>Some other header</div>,
                <div>Another one</div>,
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('renders an element instead of a label', () => {
      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={data}
              columns={[
                { element: <i className="fa fa-some-icon" />, value: 'name' },
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('renders column widths', () => {
      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={data}
              columns={[
                { label: 'Name', value: 'name', width: '20px' },
                { label: 'Email', value: 'email', width: '80px' },
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
  it('sorts on click', () => {
    const table = mount(
      withTheme(
        <DataTable
          data={data}
          sortBy="email"
          sortOrder="asc"
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
      )
    );

    const $nameHeader = table.find('thead td').at(0);
    const $emailHeader = table.find('thead td').at(1);
    $nameHeader.simulate('click');
    // Albert should be first, since we are sorting by name now.
    expect(getFirstRowName(table)).toEqual('Albert');
    // Back to email
    $emailHeader.simulate('click');
    expect(getFirstRowName(table)).toEqual('Bob');
    // Click again to reverse the order.
    $emailHeader.simulate('click');
    expect(getFirstRowName(table)).toEqual('Ty');
    // Back to ascending
    $emailHeader.simulate('click');
    expect(getFirstRowName(table)).toEqual('Bob');
  });
  it('handles custom sorting logic', () => {
    // Custom sort function to sort by length instead of alphabetized.
    const sortByNameLength = row => row.name.length;

    const table = mount(
      withTheme(
        <DataTable
          data={data}
          sortBy="name"
          sortOrder="asc"
          columns={[
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
          ]}
          sortOverrides={{ name: sortByNameLength }}
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
      )
    );
    // Ty has the shortest name, so they should be first
    expect(getFirstRowName(table)).toEqual('Ty');
  });
});
