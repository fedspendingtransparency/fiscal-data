import React from 'react';
import { render } from '@testing-library/react';
import DataPreviewChart, { chartHooks } from './data-preview-chart';
import { callbacks, dataTableChartNotesText, determineFormat, legendColors, setFieldsToChart } from './chart-helper';
import * as Helpers from '../../dataset-data/dataset-data-helper/dataset-data-helper';
import userEvent from '@testing-library/user-event';
import {
  mockData,
  mockDataPanelLegend,
  mockDataWithBillionsOnAxis,
  mockDateField,
  mockPivot,
  mockPivotWithRounded,
  mockSlug,
  mockTable,
} from './chart-test-helper';

jest.mock('../../charts/chart-primary', () => () => {
  return {
    __esModule: true,
    default: jest.fn(),
    onUpdateChartWidth: jest.fn(),
  };
});
jest.useFakeTimers();

describe('Dataset Chart', () => {
  it('shows subtitle and y axis label with rounded denomination if config set', () => {
    const { getByText } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivotWithRounded} slug={mockSlug} currentTable={mockTable} />
    );

    expect(getByText('Millions')).toBeInTheDocument();
  });

  it('shows y axis label with larger axis values', () => {
    const { getByText } = render(
      <DataPreviewChart
        data={mockDataWithBillionsOnAxis}
        dateField={mockDateField}
        selectedPivot={mockPivotWithRounded}
        slug={mockSlug}
        currentTable={mockTable}
      />
    );

    expect(getByText('Millions')).toBeInTheDocument();
  });

  it('sets chart fields correctly', () => {
    const fields = { E: 'CURRENCY0', B: 'NOT CURRENCY', A: 'CURRENCY' };

    expect(setFieldsToChart(fields, mockPivot)).toStrictEqual(['A', 'E']);
  });

  it('calls the onHover and onLabelChange functions when hovered or clicked for the footer legend', async () => {
    const { findAllByTestId } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );

    const checkboxLabels = await findAllByTestId('checkbox-label-element');
    const checkboxInputs = await findAllByTestId('checkbox-input-element');

    const hoverSpy = jest.spyOn(callbacks, 'onHover');
    const labelChangeSpy = jest.spyOn(callbacks, 'onLabelChange');

    userEvent.hover(checkboxLabels[0]);
    expect(hoverSpy).toHaveBeenCalled();

    userEvent.click(checkboxInputs[0]);
    expect(labelChangeSpy).toHaveBeenCalled();
  });

  it('calls the onHover and onLabelChange functions when hovered or clicked for the side panel legend', async () => {
    const { findAllByTestId } = render(
      <DataPreviewChart data={mockDataPanelLegend} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );

    const checkboxLabels = await findAllByTestId('checkbox-label-element');
    const checkboxInputs = await findAllByTestId('checkbox-input-element');

    const hoverSpy = jest.spyOn(callbacks, 'onHover');
    const labelChangeSpy = jest.spyOn(callbacks, 'onLabelChange');

    userEvent.hover(checkboxLabels[0]);
    expect(hoverSpy).toHaveBeenCalled();

    userEvent.click(checkboxInputs[0]);
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

    render(<DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />);

    expect(thinnerSpy).toHaveBeenCalledWith(mockData.data, mockSlug, mockDateField, mockTable);
  });

  // Currently only Debt to the Penny and Historical QTC has chart notes.
  it('displays chart notes on tables that require them', async () => {
    const { queryByText } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );

    expect(queryByText(dataTableChartNotesText)).not.toBeInTheDocument();

    const chartNoteSlug = '/qtcb-historical-interest-rates/';
    const { findByText } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={chartNoteSlug} currentTable={mockTable} />
    );

    expect(await findByText(dataTableChartNotesText)).toBeInTheDocument();
  });

  it(`attaches the "legendActive" class to the main container if and only if the legend visibility
    prop is truthy`, () => {
    const { container, getByRole } = render(
      <DataPreviewChart data={mockDataPanelLegend} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );
    expect(container.querySelector('.legendActive')).toBeInTheDocument();
    const showLegendButton = getByRole('button', { name: 'Hide Legend' });
    userEvent.click(showLegendButton);
    expect(container.querySelector('.legendActive')).not.toBeInTheDocument();
  });

  it('calls onUpdateChartWidth when page size is updated', () => {
    const { rerender } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );

    const updateChartWidthSpy = jest.spyOn(chartHooks, 'onUpdateChartWidth');
    updateChartWidthSpy.mockClear();
    global.window.innerWidth = 400;

    // jest needs the component to manually update...
    // in order to pick up the change from global.window.innerWidth above
    rerender(<DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />);

    expect(updateChartWidthSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateChartWidth when the legend is shown or hidden', () => {
    const { getByRole } = render(
      <DataPreviewChart data={mockDataPanelLegend} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );
    const updateChartWidthSpy = jest.spyOn(chartHooks, 'onUpdateChartWidth');
    const showLegendButton = getByRole('button', { name: 'Hide Legend' });
    userEvent.click(showLegendButton);
    expect(updateChartWidthSpy).toHaveBeenCalled();
    updateChartWidthSpy.mockClear();

    userEvent.click(showLegendButton);
    expect(updateChartWidthSpy).toHaveBeenCalled();
  });

  it('should render the panel legend when there are more than 12 fields with a legend toggle button', () => {
    const { getByRole } = render(
      <DataPreviewChart data={mockDataPanelLegend} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );
    const showLegendButton = getByRole('button', { name: 'Hide Legend' });
    expect(showLegendButton).toBeInTheDocument();
  });

  it('should render the footer legend when there are less than 13 fields', () => {
    const { queryByRole } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );
    const showLegendButton = queryByRole('button', { name: 'Hide Legend' });
    // Show / hide legend button is not included in the footer legend
    expect(showLegendButton).not.toBeInTheDocument();
  });

  it('should use set of colors for the legend checkboxes', async () => {
    const { getAllByTestId } = render(
      <DataPreviewChart data={mockData} dateField={mockDateField} selectedPivot={mockPivot} slug={mockSlug} currentTable={mockTable} />
    );
    const checkboxes = getAllByTestId('checkboxLabelContainer');
    checkboxes.forEach((box, i) => {
      expect(box).toHaveStyle({ backgroundColor: legendColors[i] });
    });
  });
});
