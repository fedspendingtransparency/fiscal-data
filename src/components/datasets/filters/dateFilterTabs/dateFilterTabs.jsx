import React from 'react';
import { Tab, Tabs, ThemeProvider } from '@mui/material';
import Analytics from '../../../../utils/analytics/analytics';
import { dsTheme } from '../../../../theme';

export const a11yProps = index => ({
  id: `filter-tab-${index}`,
  'aria-controls': `filter-tab-${index}`,
  'data-testid': `filter-tab-${index}`,
});

export const startDateToggleClickAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Date Range Toggle Click',
  label: 'Start Date',
};

export const timeRangeToggleClickAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Date Range Toggle Click',
  label: 'Time Range',
};

const DateFilterTabs = ({ selectedTab, setSelectedTab, onGroupReset, startDateComponent, timeRangeComponent }) => {
  const handleSelectTab = (_, tab) => {
    if (selectedTab !== tab) {
      onGroupReset('startDate');
      onGroupReset('dateRange');

      Analytics.event(tab === 0 ? startDateToggleClickAnalyticsObject : timeRangeToggleClickAnalyticsObject);
    }
    setSelectedTab(tab);
  };

  return (
    <>
      <ThemeProvider theme={dsTheme}>
        <Tabs value={selectedTab} onChange={handleSelectTab} indicatorColor="primary" className="dateFilterTabs" data-testid={'date-filter-tabs'}>
          <Tab label="Start Date" {...a11yProps(0)} />
          <Tab label="Time Range" {...a11yProps(1)} />
        </Tabs>
        {selectedTab === 1 ? timeRangeComponent : startDateComponent}
      </ThemeProvider>
    </>
  );
};

export default DateFilterTabs;
