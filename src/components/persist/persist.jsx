import React, { useState } from 'react';
import { DownloadsProvider } from './download-persist/downloads-persist';

export const siteContext = React.createContext({
  // defaults to aid in test isolation
  keywords: '',
  setKeywords: () => {},
  beginDate: null,
  setBeginDate: () => {},
  endDate: null,
  setEndDate: () => {},
  exactRange: false,
  setExactRange: () => {},
  dateRangeTab: 0,
  setDateRangeTab: () => {},
  showExperimentalFeatures: false,
  setShowExperimentalFeatures: () => {},
});
export const Provider = ({ children }) => {
  const [keywords, setKeywords] = useState('');
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exactRange, setExactRange] = useState(false);
  const [dateRangeTab, setDateRangeTab] = useState(0);
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);

  return (
    <siteContext.Provider
      value={{
        keywords,
        setKeywords,
        beginDate,
        setBeginDate,
        endDate,
        setEndDate,
        exactRange,
        setExactRange,
        dateRangeTab,
        setDateRangeTab,
        showExperimentalFeatures,
        setShowExperimentalFeatures,
      }}
    >
      <DownloadsProvider>{children}</DownloadsProvider>
    </siteContext.Provider>
  );
};

const Persist = ({ element }) => <Provider>{element}</Provider>;

export default Persist;
