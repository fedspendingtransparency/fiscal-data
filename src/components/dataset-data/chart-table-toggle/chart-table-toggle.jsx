import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';
import NotShownMessage from '../table-section-container/not-shown-message/not-shown-message';
import Analytics from '../../../utils/analytics/analytics';
import HideLegendToggle from '../hide-legend-toggle/hideLegendToggle';
import { chartBorder, tabBorder, tabIcon } from './chart-table-toggle.module.scss';
import { getMessageForUnmatchedUserFilter } from '../../filter-download-container/user-filter/user-filter';
import { faSlidersH, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import ResetTableSection from '../../data-table/reset-table-section/reset-table-section';
import Experimental from '../../experimental/experimental';

export const allTablesSelectedBody = 'With the current "All Data Tables" selection, we are' + ' unable to render a Table or Chart at this time.';
export const emptyDataMessageBody = 'With the current Date Range selected' + ' we are unable to render a preview at this time.';
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

const AntTabs = withStyles({
  root: {
    marginBottom: '-0.875rem',
  },
  indicator: {
    backgroundColor: '#0071bc',
    height: 4,
  },
  flexContainer: {
    borderWidth: '1px',
  },
})(Tabs);

const AntTab = withStyles({
  root: {
    borderRight: '1px solid #dddddd',
    textTransform: 'none',
    fontSize: '14px',
    fontFamily: 'Source Sans Pro',
    minHeight: 0,
    opacity: 1,
    letterSpacing: 'normal',
    '&$selected': {
      color: '#0071bc',
      fontWeight: 600,
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 113, 188, 0.1)',
    },
    '&:focus': {
      backgroundColor: '#dff2f7',
    },
  },
  wrapper: {
    flexDirection: 'row',
  },
  selected: {},
})(Tab);

const ChartTableToggle = ({
  currentTab,
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
  filtersActive,
  setResetFilters,
}) => {
  const [tabState, setTabState] = React.useState(currentTab);

  const handleChange = (event, newValue) => {
    onTabChange(newValue);
    setTabState(newValue);

    if (newValue === 1) {
      Analytics.event({
        category: 'Chart Enabled',
        action: table.props.tableProps.tableName,
      });
    }
  };

  let emptyDataMessage = null;

  if (allTablesSelected) {
    emptyDataMessage = <NotShownMessage heading={allTablesSelectedBody} />;
  } else if (userFilterUnmatchedForDateRange) {
    emptyDataMessage = getMessageForUnmatchedUserFilter(selectedTable);
  } else if (emptyData) {
    emptyDataMessage = <NotShownMessage heading="Change selections in order to preview data" bodyText={emptyDataMessageBody} />;
  }

  const emptyChartMessage = !unchartable || allTablesSelected ? emptyDataMessage : null;

  return (
    <div className={tabState || emptyData || allTablesSelected ? chartBorder : ''}>
      <div className={tabState || emptyData || allTablesSelected ? '' : tabBorder}>
        <AntTabs value={tabState} onChange={handleChange} aria-label="Data preview tab set">
          <AntTab
            label="Table"
            data-testid="tableTab"
            icon={<FontAwesomeIcon icon={faTable} className={tabIcon} size="1x" />}
            {...a11yProps(0)}
            disableRipple
          />
          <AntTab
            label="Chart"
            data-testid="chartTab"
            className="datasetChartEnabled"
            icon={<FontAwesomeIcon icon={faChartBar} className={tabIcon} size="1x" />}
            {...a11yProps(1)}
            disableRipple
          />
          {selectedTab === 1 ? (
            <HideLegendToggle
              displayText={legend ? 'Hide Legend' : 'Show Legend'}
              displayIcon={faSlidersH}
              showToggle={showToggleChart}
              onToggleLegend={onToggleLegend}
              selectedTab={selectedTab === 1}
            />
          ) : (
            <HideLegendToggle
              displayText="Select Columns"
              displayIcon={faCrosshairs}
              showToggle={showToggleTable}
              onToggleLegend={onToggleLegend}
              selectedTab={selectedTab === 0}
            />
          )}
        </AntTabs>
      </div>
      <Experimental featureId="react-table-poc">
        <ResetTableSection resetColumns={() => setResetFilters(true)} active={filtersActive} />
      </Experimental>
      <TabPanel index={0} value={tabState}>
        {emptyDataMessage ? emptyDataMessage : table}
      </TabPanel>
      <TabPanel index={1} value={tabState}>
        {emptyChartMessage ? emptyChartMessage : chart}
      </TabPanel>
    </div>
  );
};

export default ChartTableToggle;
