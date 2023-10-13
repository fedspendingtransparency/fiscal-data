import renderer from 'react-test-renderer';
import React from 'react';
import PivotOptions from './pivot-options';
import SelectControl from '../../../select-control/select-control';

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

  const component = renderer.create(
    <PivotOptions
      table={selectedTable}
      pivotSelection={{
        pivotView: selectedTable.dataDisplays[0],
        pivotValue: null,
      }}
      setSelectedPivot={mockSetSelectedPivot}
    />
  );
  const instance = component.root;

  it('toolbar and select controls do not exist', () => {
    expect(instance.findAllByProps({ 'data-testid': 'pivotOptionsBar' })).toStrictEqual([]);
    expect(instance.findAllByProps({ 'data-testid': 'pivotSelectLabel' })).toStrictEqual([]);
  });
});

jest.useFakeTimers();
describe('PivotOptions component does render children', () => {
  let component = renderer.create();
  let instance;
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
    ],
    valueFieldOptions: ['book_value_amt', 'fine_troy_ounce_qty'],
  };

  const mockSetSelectedPivot = jest.fn(pivot => {
    component.update(<PivotOptions table={selectedTable} pivotSelection={pivot} setSelectedPivot={mockSetSelectedPivot} />);
  });
  renderer.act(() => {
    component = renderer.create(
      <PivotOptions
        table={selectedTable}
        pivotSelection={{
          pivotView: selectedTable.dataDisplays[1],
          pivotValue: selectedTable.fields[3],
        }}
        setSelectedPivot={mockSetSelectedPivot}
      />
    );
  });

  instance = component.root;

  it('creates the options bar', () => {
    instance.findByProps({ 'data-testid': 'pivotOptionsBar' });
  });

  it('creates two select/dropdown controls and two text labels', () => {
    expect(instance.findAllByProps({ 'data-testid': 'pivotSelectLabel' }).length).toBe(2);
    const [pivotViewSelector, pivotValueSelector] = instance.findAllByType(SelectControl);
    expect(pivotViewSelector.props.options.map(opt => opt.title)).toEqual([
      'Top Secret',
      'Additional Columns',
      'By Facility',
      'By Form',
      'Complete Table',
    ]);
    expect(pivotValueSelector.props.options.map(opt => opt.prettyName)).toEqual(['Fine Troy Ounces', 'Book Value']);
  });

  it('changes the pivot options when the pivot view changes, but only if it should', () => {
    const dataDisplaysLen = selectedTable.dataDisplays.length;
    const [viewSelectControl, valueSelectControl] = instance.findAllByType(SelectControl);
    // on render the options are this
    expect(valueSelectControl.props.options).toStrictEqual([selectedTable.fields[2], selectedTable.fields[3]]);
    // run the changeHandler
    renderer.act(() => {
      viewSelectControl.props.changeHandler(selectedTable.dataDisplays[dataDisplaysLen - 1]);
    });
    // and now the options are that
    expect(valueSelectControl.props.options).toStrictEqual([{ prettyName: '— N / A —' }]);
  });

  it('allows pivot views to provide their own pivot options when selected', () => {
    const [viewSelectControl, valueSelectControl] = instance.findAllByType(SelectControl);
    // Change the selected pivot view
    renderer.act(() => {
      viewSelectControl.props.changeHandler(selectedTable.dataDisplays[0]);
    });
    expect(valueSelectControl.props.options).toStrictEqual(selectedTable.dataDisplays[0].uniquePivotValues);
    expect(valueSelectControl.props.selectedOption).toStrictEqual(selectedTable.dataDisplays[0].uniquePivotValues[0]);
  });

  it('persists the selected pivot value when switching between unique pivot value lists if the pivot value is available', () => {
    const [viewSelectControl, valueSelectControl] = instance.findAllByType(SelectControl);
    // Change the selected pivot view
    renderer.act(() => {
      viewSelectControl.props.changeHandler(selectedTable.dataDisplays[1]);
    });
    jest.runAllTimers();
    expect(valueSelectControl.props.options).toStrictEqual(selectedTable.dataDisplays[1].uniquePivotValues);
    expect(valueSelectControl.props.selectedOption).toStrictEqual(selectedTable.dataDisplays[0].uniquePivotValues[0]);
  });

  it('uses defaulted data table pivot values when pivot view does not provide its own pivot options', () => {
    const [viewSelectControl, valueSelectControl] = instance.findAllByType(SelectControl);
    // Change the selected pivot view
    renderer.act(() => {
      viewSelectControl.props.changeHandler(selectedTable.dataDisplays[2]);
    });
    expect(valueSelectControl.props.options.sort((a, b) => a.columnName.localeCompare(b.columnName)).map(opt => opt.columnName)).toStrictEqual(
      selectedTable.valueFieldOptions
    );
    expect(selectedTable.valueFieldOptions.some(opt => opt === valueSelectControl.props.selectedOption.columnName)).toBeTruthy();
  });
});
