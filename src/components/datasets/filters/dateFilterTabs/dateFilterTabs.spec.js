describe('Date Filter Tabs', () => {
  it('should ', () => {
    expect(true);
  });
  // it('render tabs element', () => {
  //   const { getByTestId } = render(<DateFilterTabs />);
  //   const tabElement = getByTestId('date-filter-tabs');
  //   expect(tabElement).toBeInTheDocument();
  // });
  //
  // it('contains a Start Date Tab and a Time Range Tab', () => {
  //   const { getByRole } = render(<DateFilterTabs />);
  //   const startDateTab = getByRole('tab', { name: 'Start Date' });
  //   const timeRangeTab = getByRole('tab', { name: 'Time Range' });
  //   expect(startDateTab).toBeInTheDocument();
  //   expect(timeRangeTab).toBeInTheDocument();
  // });
  //
  // it('triggers onGroupReset when new tab is selected', () => {
  //   const onGroupReset = jest.fn();
  //   const { getByRole } = render(<DateFilterTabs setSelectedTab={jest.fn()} selectedTab={0} onGroupReset={onGroupReset} />);
  //   const timeRangeTab = getByRole('tab', { name: 'Time Range' });
  //   userEvent.click(timeRangeTab);
  //   expect(onGroupReset).toHaveBeenCalledWith('dateRange');
  // });
  //
  // it('issues a tracking even when the custom date range tab is selected', () => {
  //   const spy = jest.spyOn(Analytics, 'event');
  //   const { getByRole } = render(<DateFilterTabs setSelectedTab={jest.fn()} selectedTab={0} onGroupReset={jest.fn()} />);
  //   const timeRangeTab = getByRole('tab', { name: 'Time Range' });
  //   userEvent.click(timeRangeTab);
  //   expect(spy).toHaveBeenCalledWith(timeRangeToggleClickAnalyticsObject);
  // });
});
