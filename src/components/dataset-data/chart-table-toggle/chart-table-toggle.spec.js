import React from 'react';
import {render} from "@testing-library/react";
import ChartTableToggle, {allTablesSelectedBody} from './chart-table-toggle';
import Analytics from "../../../utils/analytics/analytics";

describe('Chart Table Toggle 0', () => {
  const onTabChange = jest.fn();
  const onToggleLegend = jest.fn();
  const spyProps = {
    onTabChange: onTabChange,
    onToggleLegend: onToggleLegend
  };
  const gaSpy = jest.spyOn(Analytics, 'event');
  const dummyTableName = 'Oh how the turntables have turned';
  const tableProps = {
    props: {
      tableProps: {
        tableName: dummyTableName
      }
    }
  };
  const mockTable = 'table contents';
  const mockChart = 'chart contents';

  it('creates tabs for the table and chart', () => {
    const {getByTestId} = render(
      <ChartTableToggle currentTab={0}
                        onTabChange={onTabChange}
                        table={mockTable}
                        chart={mockChart}
      />
    );
    expect(getByTestId('tableTab')).toBeDefined();
    expect(getByTestId('chartTab')).toBeDefined();
  });

  it('renders tab contents as expected', () => {
    const {getByText} = render(
      <ChartTableToggle currentTab={0}
                        onTabChange={onTabChange}
                        table={mockTable}
                        chart={mockChart}
      />
    );
    expect(getByText(mockTable)).toBeDefined();
    expect(getByText(mockChart)).toBeDefined();
  });

  it('does not display a table or chart when the All Data Tables option is selected', () => {
    const {getAllByText} = render(
      <ChartTableToggle currentTab={0}
                        onTabChange={onTabChange}
                        table={mockTable}
                        chart={mockChart}
                        allTablesSelected
      />
    );

    expect(getAllByText(allTablesSelectedBody).length).toBe(2);
  });

  it('tracks when the chart is enabled', () => {
    const {getByTestId} = render(
      <ChartTableToggle currentTab={0}
                        emptyData
                        table={tableProps}
                        onTabChange={spyProps.onTabChange}
                        chart={mockChart}
      />
    );

    const tabSpy = jest.spyOn(spyProps, 'onTabChange');

    const chartTab = getByTestId('chartTab').firstChild;
    chartTab.click();

    expect(tabSpy).toHaveBeenCalledWith(1);
    expect(gaSpy).toHaveBeenCalledWith({
      category: 'Chart Enabled',
      action: dummyTableName,
    });
  });

  it('displays the select column tab when selectColumns on table tab', () => {
    const {getByRole} = render(<ChartTableToggle 
      currentTab={0}
      emptyData
      table={tableProps}
      onTabChange={spyProps.onTabChange}
      chart={mockChart}
      showToggleTable={true}
      selectedTab={0}
      onToggleLegend={spyProps.onToggleLegend} />);

      expect(getByRole('button', {name:'Select Column'})).toBeInTheDocument();
  });

  it('does not display the select column tab when selectColumns on chart tab', () => {
    const {queryByRole} = render(<ChartTableToggle 
      currentTab={1}
      emptyData
      table={tableProps}
      onTabChange={spyProps.onTabChange}
      chart={mockChart}
      showToggleChart={true}
      selectedTab={1} />);

      expect(queryByRole('button', {name:'Select Column'})).not.toBeInTheDocument();
  });

  it('does not display the select column tab when showToggleTable is false', () => {
    const {queryByRole} = render(<ChartTableToggle 
      currentTab={0}
      emptyData
      table={tableProps}
      onTabChange={spyProps.onTabChange}
      chart={mockChart}
      showToggleTable={false}
      selectedTab={0}
      onToggleLegend={spyProps.onToggleLegend} />);

      expect(queryByRole('button', {name:'Select Column'})).not.toBeInTheDocument();
  });
  
});
