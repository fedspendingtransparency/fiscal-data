import React, { useEffect, useState } from 'react';
import { a11yProps } from '../datasets/filters/dateFilterTabs/dateFilterTabs';
import { ThemeProvider } from '@mui/material/styles';
import { dpTheme } from '../../theme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import DataDictionary from '../data-dictionary/data-dictionary';
import NotesAndLimitations from './notes-and-limitations/notes-and-limitations';
import MetadataTab from '../metadata-tab/metadata-tab';
import DataTablesTab from '../datatables-tab/datatables-tab';
import { withWindowSize } from 'react-fns';
import { breakpointSm } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';

const DatasetPropertiesTabs = ({ config, test, width }) => {
  const [dictionaryPerPage, setDictionaryPerPage] = useState(5);
  const hideRawDataTable = config?.hideRawDataTable;
  const TabPanel = ({ children, value, index, ...other }) => (
    <Typography
      component="div"
      role="tabpanel"
      id={`filter-tabpanel-${index}`}
      aria-labelledby={`filter-tab-${index}`}
      className={value !== index ? 'hidden' : ''}
      {...other}
    >
      {<Box p={0}>{children}</Box>}
    </Typography>
  );

  const SCROLL_TYPE = {
    AUTO: 'auto',
    ON: 'on',
  };

  const [value, setValue] = useState(0);
  const [scrollButton, setScrollButton] = useState(SCROLL_TYPE.ON);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const rawDataTableTabs = [
    {
      label: 'Data Dictionary',
      content: <DataDictionary datasetName={config.name} apis={config.apis} perPage={dictionaryPerPage} setPerPage={setDictionaryPerPage} />,
      apiTabVisibility: hideRawDataTable,
    },
    {
      label: 'Data Tables',
      content: <DataTablesTab datasetName={config.name} apis={config.apis} />,
      apiTabVisibility: hideRawDataTable,
    },
  ];

  const datasetTabs = [
    {
      label: 'Metadata',
      content: <MetadataTab config={config} />,
    },
    {
      label: 'Notes & Known Limitations',
      content: <NotesAndLimitations bodyText={config.notesAndKnownLimitations} apis={config.apis} hideRawDataTable={hideRawDataTable} />,
    },
  ];

  const tabs = !hideRawDataTable ? [...rawDataTableTabs, ...datasetTabs] : [...datasetTabs];

  useEffect(() => {
    setScrollButton(width <= pxToNumber(breakpointSm) ? SCROLL_TYPE.ON : SCROLL_TYPE.AUTO);
  }, [width]);

  return (
    <div data-testid="tabsContainer">
      <ThemeProvider theme={dpTheme}>
        <div style={{ marginBottom: '0.875rem' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant={test ? 'standard' : 'scrollable'}
            scrollButtons={scrollButton}
            aria-label="Dataset properties tabs"
            indicatorColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} {...a11yProps(index)} data-testid={tab.label} />
            ))}
          </Tabs>
        </div>
        {tabs.map((c, index) => (
          <TabPanel key={index} index={index} value={value}>
            {c.content}
          </TabPanel>
        ))}
      </ThemeProvider>
    </div>
  );
};
export default withWindowSize(DatasetPropertiesTabs);
