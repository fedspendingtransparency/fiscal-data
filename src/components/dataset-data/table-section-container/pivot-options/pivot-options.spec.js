import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import PivotOptions from './pivot-options';
import userEvent from '@testing-library/user-event';

describe('PivotOptions component does not render children', () => {
  const selectedTable = {
    dataDisplays: [{ chartType: 'none', dimensionField: null, title: 'Complete Table' }],
    fields: [
      { columnName: 'facility_desc', prettyName: 'Facility Description' },
      { columnName: 'form_desc', prettyName: 'Form Description' },
      { columnName: 'fine_troy_ounce_qty', prettyName: 'Fine Troy Ounces' },
      { columnName: 'book_value_amt', prettyName: 'Book Value' },
    ],
  };

  const mockSetSelectedPivot = jest.fn();

  it('toolbar and select controls do not exist', () => {
    const { queryAllByTestId } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[0],
          pivotValue: null,
        }}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );
    expect(queryAllByTestId('pivotOptionsBar')).toStrictEqual([]);
    expect(queryAllByTestId('pivotSelectLabel')).toStrictEqual([]);
  });
});

jest.useFakeTimers();
describe('PivotOptions component does render children', () => {
  const selectedTable = {
    dataDisplays: [
      {
        chartType: null,
        dimensionField: 'devs_only',
        title: 'Top Secret',
        uniquePivotValues: [
          { columnName: 'red_shirts', prettyName: 'Expendable Star Trek Crew' },
          { columnName: 'jedis_are_better', prettyName: 'Star Wars > Star Trek' },
        ],
      },
      {
        chartType: null,
        dimensionField: 'additional_columns',
        title: 'Additional Columns',
        uniquePivotValues: [
          { columnName: 'cheesy_title', prettyName: 'Gouda to Meet You' },
          { columnName: 'red_shirts', prettyName: 'Expendable Star Trek Crew' },
        ],
      },
      { chartType: null, dimensionField: 'facility_desc', title: 'By Facility' },
      { chartType: null, dimensionField: 'form_desc', title: 'By Form' },
      { chartType: 'none', dimensionField: null, title: 'Complete Table' },
    ],
    fields: [
      { columnName: 'facility_desc', prettyName: 'Facility Description' },
      { columnName: 'form_desc', prettyName: 'Form Description' },
      { columnName: 'fine_troy_ounce_qty', prettyName: 'Fine Troy Ounces' },
      { columnName: 'book_value_amt', prettyName: 'Book Value' },
      { columnName: 'additional_columns', prettyName: 'Additional Columns' },
      { columnName: 'devs_only', prettyName: 'Top Secret' },
      { columnName: 'cheesy_title', prettyName: 'Gouda to Meet You' },
      { columnName: 'red_shirts', prettyName: 'Expendable Star Trek Crew' },
      { columnName: 'jedis_are_better', prettyName: 'Star Wars > Star Trek' },
      { prettyName: '— N / A —' },
    ],
    valueFieldOptions: ['book_value_amt', 'fine_troy_ounce_qty'],
  };

  it('creates the options bar', () => {
    const { getByTestId } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={jest.fn()}
      />
    );
    expect(getByTestId('pivotOptionsBar')).toBeInTheDocument();
  });

  it('creates two select/dropdown controls and two text labels', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const pivotViewOptions = ['Top Secret', 'Additional Columns', 'By Facility', 'By Form', 'Complete Table'];
    const pivotValueOptions = ['Fine Troy Ounces', 'Book Value'];
    const { queryAllByTestId, getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={jest.fn()}
      />
    );
    expect(queryAllByTestId('pivotSelectLabel').length).toBe(2);
    const pivotViewSelector = getByRole('button', { name: 'Change pivot view from Additional Columns' });
    const pivotValueSelector = getByRole('button', { name: 'Change pivot value from Book Value' });

    await user.click(pivotViewSelector);
    pivotViewOptions.forEach(option => {
      expect(getByRole('button', { name: option })).toBeInTheDocument();
    });

    await user.click(pivotValueSelector);
    pivotValueOptions.forEach(option => {
      expect(getByRole('button', { name: option })).toBeInTheDocument();
    });
  });

  it('changes the pivot options when the pivot view changes, but only if it should', () => {
    // const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const pivotValueOptions = [selectedTable.fields[2], selectedTable.fields[3]];
    const { getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={jest.fn()}
      />
    );
    const pivotViewSelector = getByRole('button', { name: 'Change pivot view from Additional Columns' });
    const pivotValueSelector = getByRole('button', { name: 'Change pivot value from Book Value' });
    // on render the options are this
    fireEvent.click(pivotValueSelector);
    pivotValueOptions.forEach(option => {
      expect(getByRole('button', { name: option.prettyName })).toBeInTheDocument();
    });
    // run the changeHandler
    fireEvent.click(pivotViewSelector);
    fireEvent.click(getByRole('button', { name: 'Complete Table' }));

    // and now the options are that
    expect(getByRole('button', { name: '— N / A —' })).toBeInTheDocument();
  });

  it('allows pivot views to provide their own pivot options when selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const setSelectedPivotSpy = jest.fn();
    const { getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={setSelectedPivotSpy}
      />
    );
    const pivotViewSelector = getByRole('button', { name: 'Change pivot view from Additional Columns' });
    const pivotValueSelector = getByRole('button', { name: 'Change pivot value from Book Value' }); // Change the selected pivot view
    await user.click(pivotViewSelector);
    await user.click(getByRole('button', { name: selectedTable.dataDisplays[0].title }));
    await user.click(pivotValueSelector);

    selectedTable.dataDisplays[0].uniquePivotValues.forEach(option => {
      expect(getByRole('button', { name: option.prettyName })).toBeInTheDocument();
    });
    expect(setSelectedPivotSpy).toHaveBeenCalledWith({
      pivotValue: { columnName: 'red_shirts', prettyName: 'Expendable Star Trek Crew' },
      pivotView: {
        chartType: null,
        dimensionField: 'devs_only',
        title: 'Top Secret',
        uniquePivotValues: [
          { columnName: 'red_shirts', prettyName: 'Expendable Star Trek Crew' },
          { columnName: 'jedis_are_better', prettyName: 'Star Wars > Star Trek' },
        ],
      },
    });
  });

  it('persists the selected pivot value when switching between unique pivot value lists if the pivot value is available', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={jest.fn()}
      />
    );
    const viewSelectControl = getByRole('button', { name: 'Change pivot view from Additional Columns' });
    const valueSelectControl = getByRole('button', { name: 'Change pivot value from Book Value' });
    // Change the selected pivot view
    await user.click(viewSelectControl);
    await user.click(getByRole('button', { name: selectedTable.dataDisplays[1].title }));
    await user.click(valueSelectControl);

    selectedTable.dataDisplays[1].uniquePivotValues.forEach(pivotValue => {
      expect(getByRole('button', { name: pivotValue.prettyName })).toBeInTheDocument();
    });
  });

  it('uses defaulted data table pivot values when pivot view does not provide its own pivot options', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={jest.fn()}
      />
    );
    const viewSelectControl = getByRole('button', { name: 'Change pivot view from Additional Columns' });
    const valueSelectControl = getByRole('button', { name: 'Change pivot value from Book Value' });
    await user.click(viewSelectControl);
    await user.click(getByRole('button', { name: selectedTable.dataDisplays[2].title }));

    await user.click(valueSelectControl);
    expect(getByRole('button', { name: 'Fine Troy Ounces' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Book Value' })).toBeInTheDocument();
  });

  it('updates pivot selection ', async () => {
    const setSelectedPivotSpy = jest.fn();
    let selectedPivotValue = selectedTable.fields[8];
    const selectedPivotView = selectedTable.dataDisplays[3];
    const { findByRole, getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedPivotView,
          pivotValue: selectedPivotValue,
        }}
        setSelectedPivot={setSelectedPivotSpy}
      />
    );

    getByRole('button', { name: 'Change pivot value from ' + selectedPivotValue.prettyName }).click();

    selectedPivotValue = selectedTable.fields[3];

    const button = await findByRole('button', { name: selectedPivotValue.prettyName });
    button.click();
    //setSelectedPivot is called when the pivot view is changed
    expect(setSelectedPivotSpy).toHaveBeenCalledWith({
      pivotValue: selectedPivotValue,
      pivotView: selectedPivotView,
    });
  });

  it('does not update selected pivot for complete table', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const setSelectedPivotSpy = jest.fn();
    const selectedPivotView = selectedTable.dataDisplays[4];
    const selectedPivotValue = selectedTable.fields[9];
    const { getByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedPivotView,
          pivotValue: selectedPivotValue,
        }}
        setSelectedPivot={setSelectedPivotSpy}
      />
    );

    await user.click(getByRole('button', { name: 'Change pivot view from Complete Table' }));
    await user.click(getByRole('button', { name: 'Complete Table' }));

    await user.click(getByRole('button', { name: 'Change pivot value from — N / A —' }));
    await user.click(getByRole('button', { name: '— N / A —' }));
    expect(setSelectedPivotSpy).not.toHaveBeenCalledWith({
      pivotValue: { prettyName: '— N / A —' },
      pivotView: { chartType: 'none', dimensionField: null, title: 'Complete Table' },
    });
  });

  it('hides pivot options when all data tables is selected', () => {
    const setSelectedPivotSpy = jest.fn();
    const selectedPivotView = selectedTable.dataDisplays[4];
    const selectedPivotValue = selectedTable.fields[9];
    const { queryByRole } = render(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedPivotView,
          pivotValue: selectedPivotValue,
        }}
        setSelectedPivot={setSelectedPivotSpy}
        allTablesSelected={true}
      />
    );

    expect(queryByRole('button', { name: 'Change pivot view from Complete Table' })).not.toBeInTheDocument();
  });
});
