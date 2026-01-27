import Analytics from '../../../utils/analytics/analytics';

describe('Chart Table Toggle 0', () => {
  const onTabChange = jest.fn();
  const onToggleLegend = jest.fn();
  const spyProps = {
    onTabChange: onTabChange,
    onToggleLegend: onToggleLegend,
  };
  const gaSpy = jest.spyOn(Analytics, 'event');
  const dummyTableName = 'Oh how the turntables have turned';
  const dummyDatasetName = 'dataset';
  const tableProps = {
    props: {
      tableProps: {
        tableName: dummyTableName,
      },
    },
  };
  const mockTable = 'table contents';
  const chartContents = 'chart contents';
  const mockChart = () => chartContents;
  it('should ', () => {
    expect(true);
  });
  // it('creates tabs for the table and chart', () => {
  //   const { getByRole } = render(<ChartTableToggle currentTab={0} onTabChange={onTabChange} table={mockTable} chart={mockChart} />);
  //   expect(getByRole('tab', { name: 'Table' })).toBeDefined();
  //   expect(getByRole('tab', { name: 'Chart' })).toBeDefined();
  // });
  //
  // it('renders tab contents as expected', () => {
  //   const { getByText } = render(<ChartTableToggle currentTab={0} onTabChange={onTabChange} table={mockTable} chart={mockChart} />);
  //   expect(getByText(mockTable)).toBeDefined();
  //   expect(getByText(chartContents)).toBeDefined();
  // });
  //
  // it('does not display a table or chart when the All Data Tables option is selected', () => {
  //   const { getAllByText } = render(
  //     <ChartTableToggle currentTab={0} onTabChange={onTabChange} table={mockTable} chart={mockChart} allTablesSelected />
  //   );
  //
  //   expect(getAllByText(allTablesSelectedBody).length).toBe(2);
  // });
  //
  // it('tracks when the chart is enabled', () => {
  //   const { getByRole } = render(
  //     <ChartTableToggle
  //       datasetName={dummyDatasetName}
  //       currentTab={0}
  //       emptyData
  //       table={tableProps}
  //       onTabChange={spyProps.onTabChange}
  //       chart={mockChart}
  //     />
  //   );
  //
  //   const tabSpy = jest.spyOn(spyProps, 'onTabChange');
  //
  //   const chartTab = getByRole('tab', { name: 'Chart' });
  //   userEvent.click(chartTab);
  //
  //   expect(tabSpy).toHaveBeenCalledWith(1);
  //   expect(gaSpy).toHaveBeenCalledWith({
  //     category: 'Chart Enabled',
  //     action: 'Chart Click',
  //     label: `${dummyDatasetName}, ${dummyTableName}`,
  //   });
  // });
  //
  // it('displays the select column tab when selectColumns on table tab', () => {
  //   render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       emptyData
  //       table={tableProps}
  //       onTabChange={spyProps.onTabChange}
  //       chart={mockChart}
  //       showToggleTable={true}
  //       selectedTab={0}
  //       onToggleLegend={spyProps.onToggleLegend}
  //     />
  //   );
  //
  //   const selectColButton = screen.getByRole('button', { name: /Select Columns/i });
  //   expect(selectColButton).toBeInTheDocument();
  // });
  //
  // it('calls toggle when select column tab is clicked', () => {
  //   render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       emptyData
  //       table={tableProps}
  //       onTabChange={spyProps.onTabChange}
  //       chart={mockChart}
  //       showToggleTable={true}
  //       selectedTab={0}
  //       onToggleLegend={spyProps.onToggleLegend}
  //     />
  //   );
  //
  //   const selectColButton = screen.getByRole('button', { name: /Select Columns/i });
  //
  //   userEvent.click(selectColButton);
  //   expect(selectColButton).toBeInTheDocument();
  //   expect(onToggleLegend).toHaveBeenCalledTimes(1);
  // });
  //
  // it('does not display the select column tab when selectColumns on chart tab', () => {
  //   const { queryByRole } = render(
  //     <ChartTableToggle
  //       currentTab={1}
  //       emptyData
  //       table={tableProps}
  //       onTabChange={spyProps.onTabChange}
  //       chart={mockChart}
  //       showToggleChart={true}
  //       selectedTab={1}
  //     />
  //   );
  //
  //   expect(queryByRole('button', { name: 'Select Columns' })).not.toBeInTheDocument();
  // });
  //
  // it('does not display the select column tab when showToggleTable is false', () => {
  //   const { queryByRole } = render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       emptyData
  //       table={tableProps}
  //       onTabChange={spyProps.onTabChange}
  //       chart={mockChart}
  //       showToggleTable={false}
  //       selectedTab={0}
  //       onToggleLegend={spyProps.onToggleLegend}
  //     />
  //   );
  //
  //   expect(queryByRole('button', { name: 'Select Columns' })).not.toBeInTheDocument();
  // });
  //
  // it('displays the default message for data tables with an apiFilter config', () => {
  //   const { getByText } = render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       onTabChange={onTabChange}
  //       table={mockTable}
  //       chart={mockChart}
  //       unchartable={true}
  //       selectedTable={{
  //         apiFilter: {
  //           dataDefaultHeader: 'Default Header',
  //           dataDefaultMessage: 'Default Message',
  //         },
  //       }}
  //       apiFilterDefault={true}
  //     />
  //   );
  //   expect(getByText('Default Header')).toBeInTheDocument();
  //   expect(getByText('Default Message')).toBeInTheDocument();
  // });
  //
  // it('displays the unmatched date range message for data tables with an apiFilter config', () => {
  //   const { getByText } = render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       onTabChange={onTabChange}
  //       table={mockTable}
  //       chart={mockChart}
  //       unchartable={true}
  //       selectedTable={{
  //         apiFilter: {
  //           label: 'label',
  //           dataUnmatchedHeader: 'Default Header',
  //           dataUnmatchedMessage: 'Default Message',
  //         },
  //       }}
  //       userFilterUnmatchedForDateRange={true}
  //     />
  //   );
  //   expect(getByText('Default Header')).toBeInTheDocument();
  //   expect(getByText('Default Message')).toBeInTheDocument();
  // });
  //
  // it('displays the unmatched date range message for data tables with an userFilter config', () => {
  //   const { getByText } = render(
  //     <ChartTableToggle
  //       currentTab={0}
  //       onTabChange={onTabChange}
  //       table={mockTable}
  //       chart={mockChart}
  //       unchartable={true}
  //       selectedTable={{
  //         userFilter: {
  //           label: 'label',
  //           dataUnmatchedHeader: 'Default Header',
  //           dataUnmatchedMessage: 'Default Message',
  //         },
  //       }}
  //       userFilterUnmatchedForDateRange={true}
  //     />
  //   );
  //   expect(getByText('Default Header')).toBeInTheDocument();
  //   expect(getByText('Default Message')).toBeInTheDocument();
  // });
});
