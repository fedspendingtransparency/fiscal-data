import React from 'react'
import { Tabs, Tab } from '@material-ui/core'
import Analytics from '../../../../utils/analytics/analytics';

export const a11yProps = (index) => ({
  id: `filter-tab-${index}`,
  'aria-controls': `filter-tabpanel-${index}`,
});

export const startDateToggleClickAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Date Range Toggle Click',
  label: 'Start Date'
}

export const timeRangeToggleClickAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Date Range Toggle Click',
  label: 'Time Range'
}

const DateFilterTabs = ({
  selectedTab,
  setSelectedTab,
  onGroupReset,
  startDateComponent,
  timeRangeComponent
}) => {
  const handleSelectTab = (_, tab) => {
    if (selectedTab !== tab) {
      onGroupReset("startDate");
      onGroupReset("dateRange");

      Analytics.event(tab === 0
        ? startDateToggleClickAnalyticsObject
        : timeRangeToggleClickAnalyticsObject
      );
    }
    setSelectedTab(tab)
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={handleSelectTab}
        indicatorColor="primary"
        className='dateFilterTabs'
      >
        <Tab label="Start Date" {...a11yProps(0)} />
        <Tab label="Time Range"  {...a11yProps(1)} />
      </Tabs>
      {selectedTab === 1 ? timeRangeComponent : startDateComponent}
    </>
  )
}

export default DateFilterTabs;
