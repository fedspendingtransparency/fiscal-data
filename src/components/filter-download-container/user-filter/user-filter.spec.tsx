import {render} from "@testing-library/react";
import React from "react";
import UserFilter from "./user-filter";

describe('UserFilter Component', () => {

  const ComboSelect = jest.requireActual('../../combo-select/combo-select');
  const comboSelectSpy = jest.spyOn(ComboSelect, "default");

  it('sends expected properties to combo-select control and displays notice', async () => {
    const { getByTestId } = render(
      <UserFilter
        selectedTable={mockTable}
        onUserFilter={jest.fn()}
        apiData={mockData}
      />
    );

    expect(getByTestId('userFilterNotice')).toHaveTextContent(mockTable.userFilter.notice);
    const comboSelectProps = comboSelectSpy.mock.calls[0][0];

    expect(comboSelectProps['label']).toEqual(`${mockTable.userFilter.label}:`);
    const optionsFromData = mockData.data.map(row => ({label: row.ccd, value: row.ccd}));
    expect(comboSelectProps['options']).toEqual([
      {
        label: "(None selected)",
        value: null
      }
    ].concat(optionsFromData.slice(0,4)));
    expect(comboSelectProps['selectedOption']).toEqual(null);
  });

  const mockTable = {
    userFilter: {
      label: 'Country-Currency',
      field: 'ccd',
      notice: 'this is some info related to the user-filterable data'
    }
  };

  const mockData = {
    data: [
      {
        record_date: '2023-01-01',
        rate: '1.1',
        ccd: 'red'
      },
      {
        record_date: '2023-01-01',
        rate: '1.2',
        ccd: 'blue'
      },
      {
        record_date: '2023-01-01',
        rate: '1.3',
        ccd: 'green'
      },
      {
        record_date: '2022-01-01',
        rate: '1.4',
        ccd: 'gold'
      },
      {
        record_date: '2022-01-01',
        rate: '1.0',
        ccd: 'red'
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'blue'
      },
      {
        record_date: '2022-01-01',
        rate: '1.3',
        ccd: 'green'
      },
      {
        record_date: '2022-01-01',
        rate: '2.4',
        ccd: 'gold'
      },
    ]
  };

});
