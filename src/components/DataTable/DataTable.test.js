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
      name: 'Bob',
      email: 'a@weave.works',
    },
    {
      name: 'Albert',
      // Notice the emails are inverted to test sorting by this field
      email: 'b@weave.works',
    },
    {
      name: 'Ty',
      email: 'c@weave.works',
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
          )
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
    it('renders nested rows', () => {
      const nesteData = [
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

      const tree = renderer
        .create(
          withTheme(
            <DataTable
              data={nesteData}
              sortBy="workloadId"
              sortOrder="asc"
              columns={[
                { value: 'workloadId', label: 'Workload' },
                { value: 'containers', label: 'Containers' },
                { value: 'behind', label: 'Behind' },
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
                { value: 'name', label: 'Name' },
                { value: 'email', label: 'Email' },
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
                { value: 'name', element: <i className="fa fa-some-icon" /> },
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
                { value: 'name', label: 'Name', width: '20px' },
                { value: 'email', label: 'Email', width: '80px' },
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
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
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
