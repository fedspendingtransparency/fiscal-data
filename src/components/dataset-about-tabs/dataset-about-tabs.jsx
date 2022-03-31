import React, { useEffect, useState } from 'react';
import { a11yProps} from '../datasets/filters/dateFilterTabs/dateFilterTabs';
import { MuiThemeProvider, withStyles } from "@material-ui/core";
import { theme } from '../../theme';
import Tabs from '@material-ui/core/Tabs';
import DataDictionary from "../data-dictionary/data-dictionary";
import NotesAndLimitations from './notes-and-limitations/notes-and-limitations';
import MetadataTab from "../metadata-tab/metadata-tab";
import DataTablesTab from "../datatables-tab/datatables-tab";
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { withWindowSize } from 'react-fns';
import { breakpointSm } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';

const DatasetAboutTabs = ({ config, test, width }) => {
  const TabPanel = ({children, value, index, ...other}) => (
    <Typography
      component="div"
      role="tabpanel"
      id={`filter-tabpanel-${index}`}
      aria-labelledby={`filter-tab-${index}`}
      className={value !== index ? 'hidden': ''}
      {...other}
    >
      {<Box p={0}>{children}</Box>}
    </Typography>
  );

  const AntTabDatasetDetail = withStyles({
    root: {
      marginBottom: -2,
      borderBottom: '2px solid #dddddd',
      textTransform: 'none',
      lineHeight: 'normal',
      minWidth: 0,
      letterSpacing: 0,
      fontWeight: 600,
      padding: '9px 12px',
      opacity: 1,
      '&$selected': {
        color: theme.palette.primary[500],
      },
      '&:hover': {
        backgroundColor: theme.palette.background
      }
    },
    wrapper: {
      flexDirection: 'row',
      fontSize: 16,
    },
    selected: {}
  })(Tab);

  const SCROLL_TYPE = {
    AUTO: 'auto',
    ON: 'on'
  }

  const [value, setValue] = useState(0);
  const [scrollButton, setScrollButton] = useState(SCROLL_TYPE.ON)
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: 'Data Dictionary',
      content: <DataDictionary datasetName={config.name} apis={config.apis} />
    },
    {
      label: 'Data Tables',
      content: <DataTablesTab datasetName={config.name} apis={config.apis} />
    },
    {
      label: 'Metadata',
      content: <MetadataTab config={config} />
    },
    {
      label: 'Notes & Known Limitations',
      content: <NotesAndLimitations bodyText={config.notesAndKnownLimitations} apis={config.apis} />
    },
  ]

  useEffect(() => {
    setScrollButton(width <= pxToNumber(breakpointSm) ? SCROLL_TYPE.ON : SCROLL_TYPE.AUTO);
  }, [width])

  return (
    <div data-testid="tabsContainer">
      <MuiThemeProvider theme={theme}>
        <div style={{ marginBottom: '0.875rem' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={test ? "standard" : "scrollable"}
          scrollButtons={scrollButton}
          aria-label="About This Dataset tabs"
        >
          {tabs.map((tab, index) => (
            <AntTabDatasetDetail key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
        </div>
        {tabs.map((c, index) => (
          <TabPanel
            key={index}
            index={index}
            value={value}
          >
            {c.content}
          </TabPanel>
        ))}
      </MuiThemeProvider>
    </div>
  )
}
export default withWindowSize(DatasetAboutTabs)
