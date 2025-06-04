import React from 'react';
import DataPreviewChart, { callbacks, chartHooks, dataTableChartNotesText, determineFormat, setFieldsToChart } from './data-preview-chart';
import * as Helpers from '../../dataset-data/dataset-data-helper/dataset-data-helper';
import { fireEvent, render } from '@testing-library/react';

jest.mock('../../charts/chart-primary', () => () => {
  return {
    __esModule: true,
    default: jest.fn(),
    onUpdateChartWidth: jest.fn(),
  };
});
jest.useFakeTimers();

const mockDateField = 'reporting_date';

const mockYears = {
  from: 2019,
  to: 2020,
};

const mockDateRange = {
  from: new Date(mockYears.from, 0, 1),
  to: new Date(mockYears.to, 0, 1),
};

const mockData = {
  data: [
    {
      reporting_date: `${mockYears.from}-01-01`,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    },
    {
      reporting_date: `${mockYears.to}-01-01`,
      a: 11,
      b: 12,
      c: 13,
      d: 14,
      e: 15,
    },
  ],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE',
      e: 'CURRENCY0',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
    },
  },
};

const mockDataWithBillionsOnAxis = {
  data: [
    {
      reporting_date: `${mockYears.from}-01-01`,
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    },
    {
      reporting_date: `${mockYears.to}-01-01`,
      a: 11,
      b: 12,
      c: 13,
      d: 14,
      e: 1000000000,
    },
  ],
  meta: {
    dataTypes: {
      a: 'CURRENCY',
      b: 'not currency',
      c: 'NUMBER',
      d: 'PERCENTAGE',
      e: 'CURRENCY0',
    },
    labels: {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
    },
  },
};

const mockConfig = {
  name: 'my name',
};

const mockPivotWithRounded = { pivotView: { title: 'my selection', dimensionField: 'test', roundingDenomination: 'millions' } };

const mockPivot = { pivotView: { title: 'my selection', dimensionField: 'test' } };

const mockSlug = 'mock/slug/here';

const mockTable = { tableName: 'TableOne' };

describe('Dataset Chart', () => {
  it('shows subtitle and y axis label with rounded denomination if config set', () => {
    const { getByText } = render(
      <DataPreviewChart
        config={mockConfig}
        data={mockData}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivotWithRounded}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible={true}
        legend={true}
      />
    );

    expect(getByText('Millions')).toBeInTheDocument();
  });

  it('shows y axis label with larger axis values', () => {
    const { getByText } = render(
      <DataPreviewChart
        config={mockConfig}
        data={mockDataWithBillionsOnAxis}
        dateField={mockDateField}
        dateRange={mockDateRange}
        selectedPivot={mockPivotWithRounded}
        slug={mockSlug}
        currentTable={mockTable}
        isVisible={true}
        legend={true}
      />
    );

    expect(getByText('Millions')).toBeInTheDocument();
  });

  it('sets chart fields correctly', () => {
    const fields = { E: 'CURRENCY0', B: 'NOT CURRENCY', A: 'CURRENCY' };

    expect(setFieldsToChart(fields, mockPivot)).toStrictEqual(['A', 'E']);
  });

  it('calls the onHover and onLabelChange functions when hovered or clicked', async () => {
    const { findAllByTestId } = render(
      <DataPreviewChart
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
    // true when dataType is 'CURRENCY0 ( or any CURRENCY# )'
    expect(determineFormat(['e'], mockData.meta.dataTypes)).toBe(true);
  });

  it('calls a helper method to thin out data when special cases require it', () => {
    const thinnerSpy = jest.spyOn(Helpers, 'thinDataAsNeededForChart');

    render(
      <DataPreviewChart
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

    expect(thinnerSpy).toHaveBeenCalledWith(mockData.data, mockSlug, mockDateField, mockTable);
  });

  // Currently only Debt to the Penny and Historical QTC has chart notes.
  it('displays chart notes on tables that require them', async () => {
    const { queryByText } = render(
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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
      <DataPreviewChart
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

  it('should render the panel legend when there are more than 12 fields', () => {});
  it('should render a legend toggle button with the panel legend', () => {});
  it('should render the footer legend when there are less than 13 fields', () => {});
});
