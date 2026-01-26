import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCrosshairs, faSlidersH, faTable } from '@fortawesome/free-solid-svg-icons';
import NotShownMessage from '../table-section-container/not-shown-message/not-shown-message';
import Analytics from '../../../utils/analytics/analytics';
import HideLegendToggle from '../hide-legend-toggle/hideLegendToggle';
import { chartTableToggleContainer, tabIcon } from './chart-table-toggle.module.scss';
import { getMessageForDefaultApiFilter, getMessageForUnmatchedUserFilter } from '../../filter-download-container/user-filter/user-filter';
import ResetTableSection from '../../data-table/reset-table-section/reset-table-section';
import { chartToggleTheme } from '../../../theme';

export const allTablesSelectedBody =
  'With the current "All Data Tables" selection, you may download the data, but the table and chart previews are not applicable.';
export const emptyDataMessageBody = 'With the current Date Range selected we are unable to render a preview at this time.';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      className={value !== index ? 'hidden' : ''}
      {...other}
    >
      <Box p={0}>{children}</Box>
    </Typography>
  );
};

const a11yProps = index => {
  return {
    id: `preview-tab-${index}`,
    'aria-controls': `preview-tabpanel-${index}`,
  };
};

const ChartTableToggle = ({
  currentTab,
  datasetName,
  onTabChange,
  table,
  allTablesSelected,
  selectedTable,
  emptyData,
  unchartable,
  legend,
  showToggleChart,
  showToggleTable,
  onToggleLegend,
  selectedTab,
  chart,
  userFilterUnmatchedForDateRange,
  apiFilterDefault,
  filtersActive,
  setResetFilters,
  textFilteringDisabled,
  pivotSelected,
}) => {
  const [tabState, setTabState] = React.useState(currentTab);

  const handleChange = (event, newValue) => {
    onTabChange(newValue);
    setTabState(newValue);

    if (newValue === 1) {
      Analytics.event({
        category: 'Chart Enabled',
        action: 'Chart Click',
        label: `${datasetName}, ${table.props.tableProps.tableName}`,
      });
    }
  };

  let emptyDataMessage = null;

  if (allTablesSelected) {
    emptyDataMessage = <NotShownMessage heading={allTablesSelectedBody} />;
  } else if (userFilterUnmatchedForDateRange) {
    emptyDataMessage = getMessageForUnmatchedUserFilter(selectedTable);
  } else if (apiFilterDefault) {
    emptyDataMessage = getMessageForDefaultApiFilter(selectedTable);
  } else if (emptyData) {
    emptyDataMessage = <NotShownMessage heading="Change selections in order to preview data" bodyText={emptyDataMessageBody} />;
  }

  const emptyChartMessage = !unchartable || allTablesSelected ? emptyDataMessage : null;
  return (
    <div>
      <ThemeProvider theme={chartToggleTheme}>
        <div className={chartTableToggleContainer}>
          <Tabs value={tabState} onChange={handleChange} aria-label="Data preview tab set">
            <Tab label="Table" role="tab" icon={<FontAwesomeIcon icon={faTable} className={tabIcon} size="1x" />} {...a11yProps(0)} disableRipple />
            <Tab
              label="Chart"
              role="tab"
              className="datasetChartEnabled"
              icon={<FontAwesomeIcon icon={faChartBar} className={tabIcon} size="1x" />}
              {...a11yProps(1)}
              disableRipple
            />
          </Tabs>
          <>
            {selectedTab === 1 ? (
              <HideLegendToggle
                displayText={legend ? 'Hide Legend' : 'Show Legend'}
                displayIcon={faSlidersH}
                showToggle={showToggleChart}
                onToggleLegend={onToggleLegend}
                selectedTab={selectedTab === 1}
              />
            ) : (
              !pivotSelected?.pivotValue && (
                <HideLegendToggle
                  displayText="Select Columns"
                  displayIcon={faCrosshairs}
                  showToggle={showToggleTable}
                  onToggleLegend={onToggleLegend}
                  selectedTab={selectedTab === 0}
                />
              )
            )}
          </>
        </div>
        {selectedTab === 0 && (
          <ResetTableSection resetColumns={() => setResetFilters(true)} active={filtersActive} textFilteringDisabled={textFilteringDisabled} />
        )}
        <TabPanel index={0} value={tabState}>
          {emptyDataMessage ? emptyDataMessage : table}
        </TabPanel>
        <TabPanel index={1} value={tabState}>
          {emptyChartMessage ? emptyChartMessage : chart()}
        </TabPanel>
      </ThemeProvider>
    </div>
  );
};

export default ChartTableToggle;
