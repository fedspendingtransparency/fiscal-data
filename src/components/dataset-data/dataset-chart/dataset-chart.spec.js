import React from 'react';
import DatasetChart, {
  determineFormat,
  dataTableChartNotesText,
  callbacks,
  chartHooks
} from './dataset-chart';
import globalConstants from '../../../helpers/constants';
import { chartCitationText } from './chart-citation/chart-citation';
import * as Helpers from '../dataset-data-helper/dataset-data-helper';
import { fireEvent, render } from '@testing-library/react';


jest.mock('../../charts/chart-primary', () => () => {
  return {
    __esModule: true,
    default: jest.fn(),
    onUpdateChartWidth: jest.fn()
  };
});
jest.useFakeTimers();

const mockDateField = 'reporting_date';

const mockYears = {
  from: 2019,
  to: 2020
};

const mockDateRange = {
  from: new Date(mockYears.from, 0, 1),
  to: new Date(mockYears.to, 0, 1)
};

const mockData = {
  data: [{
    reporting_date: `${mockYears.from}-01-01`,
    a: 1,
    b: 2,
    c: 3,
    d: 4
  },
  {
    reporting_date: `${mockYears.to}-01-01`,
    a: 11,
    b: 12,
    c: 13,
    d: 14
  }],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE'
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D'
    }
  }
};

const mockConfig = {
  name: 'my name'
};

const mockPivot = { pivotView: { title: 'my selection' } };

const mockSlug = 'mock/slug/here';

const mockTable = { 'tableName': 'TableOne' };

describe('Dataset Chart', () => {
  it('shows date range as years and the selected pivot', () => {
    const { getByText } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible={true}
        legend={true}
      />
    );

    const { from, to } = mockYears;
    const { title } = mockPivot.pivotView;

    expect(getByText(`${from} - ${to} | ${title}`)).toBeInTheDocument();
  });

  it('calls the onHover and onLabelChange functions when hovered or clicked', async () => {
    const { findAllByTestId } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    const checkboxLabels = await findAllByTestId('checkbox-label-element');
    const checkboxInputs = await findAllByTestId('checkbox-input-element');

    const hoverSpy = jest.spyOn(callbacks, 'onHover');
    const labelChangeSpy = jest.spyOn(callbacks, 'onLabelChange');

    fireEvent.mouseEnter(checkboxLabels[0]);
    expect(hoverSpy).toHaveBeenCalled();

    fireEvent.click(checkboxInputs[0]);
    expect(labelChangeSpy).toHaveBeenCalled();
  });

  it('passes the correct value for format property to drawChart function', () => {
    // true when dataType is 'CURRENCY'
    expect(determineFormat(['a'], mockData.meta.dataTypes)).toBe(true);
    // false when dataType is 'not currency'
    expect(determineFormat(['b'], mockData.meta.dataTypes)).toBe(false);
    // false when dataType is 'NUMBER'
    expect(determineFormat(['c'], mockData.meta.dataTypes)).toBe(false);
    // 'RATE' when dataType is 'PERCENTAGE'
    expect(determineFormat(['d'], mockData.meta.dataTypes)).toBe('RATE');
  });

  it('contains a ChartCitation component and passes slug and currentTableName props to it',
    () => {
    const { getByText } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    expect(getByText(`${globalConstants.BASE_SITE_URL}/datasets${mockSlug}`)).toBeInTheDocument();
    expect(getByText(`${mockTable.tableName}${chartCitationText}`)).toBeInTheDocument();
  });

  it('calls a helper method to thin out data when special cases require it', () => {
    const thinnerSpy = jest.spyOn(Helpers, 'thinDataAsNeededForChart');

    render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    expect(thinnerSpy).toHaveBeenCalledWith(
      mockData.data,
      mockSlug,
      mockDateField,
      mockTable
    );
  });

  // Currently only Debt to the Penny and Historical QTC has chart notes.
  it('displays chart notes on tables that require them', async () => {
    const { queryByText } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    expect(queryByText(dataTableChartNotesText)).not.toBeInTheDocument();

    const chartNoteSlug = '/qtcb-historical-interest-rates/';
    const { findByText } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={chartNoteSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    expect(await findByText(dataTableChartNotesText)).toBeInTheDocument();
  });

  it(`attaches the "legendActive" class to the main container if and only if the legend visibility
    prop is truthy`, () => {
    const { rerender, container } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );
    expect(container.querySelector('.legendActive')).toBeInTheDocument();

    rerender(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend={false}
      />
    );
    expect(container.querySelector('.legendActive')).not.toBeInTheDocument();
  });

  it('calls onUpdateChartWidth when page size is updated', () => {
    const { rerender } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    const updateChartWidthSpy = jest.spyOn(chartHooks, 'onUpdateChartWidth');
    updateChartWidthSpy.mockClear();
    global.window.innerWidth = 400;

    // jest needs the component to manually update...
    // in order to pick up the change from global.window.innerWidth above
    rerender(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    expect(updateChartWidthSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateChartWidth when the legend is shown or hidden', () => {
    const { rerender } = render(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );

    const updateChartWidthSpy = jest.spyOn(chartHooks, 'onUpdateChartWidth');
    updateChartWidthSpy.mockClear();

    rerender(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend={false}
      />
    );
    expect(updateChartWidthSpy).toHaveBeenCalledTimes(1);
    updateChartWidthSpy.mockClear();

    rerender(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend={false}
      />
    );
    expect(updateChartWidthSpy).toHaveBeenCalledTimes(0);
    updateChartWidthSpy.mockClear();

    rerender(
      <DatasetChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivot}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible
        legend
      />
    );
    expect(updateChartWidthSpy).toHaveBeenCalledTimes(1);
  });
});
