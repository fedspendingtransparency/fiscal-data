import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';

import GenerativeReportsAccountFilter from '../generative-reports-section/generative-reports-account-filter/generative-reports-account-filter';
import { defaultSelection } from '../generative-reports-section/generative-reports-section';
import DatePicker from '../../../components/date-picker/date-picker';
import { DownloadReportTable } from '../download-report-table/download-report-table';
import ReportsEmptyTable from '../reports-empty-table/reports-empty-table';

import { apiPrefix, basicFetch } from '../../../utils/api-utils';
import { buildEndpoint } from '../generative-reports-section/generative-report-helper';

import { IRunTimeReportConfig } from '../../../models/IRunTimeReportConfig';
import { IDatasetApi } from '../../../models/IDatasetApi';
import { sectionTitle } from '../published-reports';
import { filterContainer } from './filter-report-section.module.scss';

type Props = {
  reportConfig: IRunTimeReportConfig;
  apis: IDatasetApi[];
};

const FilterReportsSection: React.FC<Props> = ({ reportConfig, apis, width }) => {
  const [selectedAccount, setSelectedAccount] = useState(defaultSelection);
  const [earliestDate, setEarliest] = useState<Date>();
  const [latestDate, setLatest] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [allDates, setAllDates] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);

  const [reports, setReports] = useState<any[]>([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (!apis?.length) return;
    const e = new Date(Math.min(...apis.map(a => +new Date(a.earliestDate))));
    const l = new Date(Math.max(...apis.map(a => +new Date(a.latestDate))));
    setEarliest(e);
    setLatest(l);
    setSelectedDate(l);
    setAllDates([e.toISOString().slice(0, 7), l.toISOString().slice(0, 7)]);
    const yrs = [];
    for (let y = e.getFullYear(); y <= l.getFullYear(); y++) yrs.push(String(y));
    setAllYears(yrs);
  }, [apis]);

  useEffect(() => {
    (async () => {
      if (!selectedAccount.value || !selectedDate) {
        setReports([]);
        return;
      }
      try {
        const data = await Promise.all(
          apis.map(async api => {
            const url = `${apiPrefix}${buildEndpoint(selectedDate, api.dateField, selectedAccount.value, reportConfig.filterField, api)}`;
            const res = await basicFetch(url);
            return {
              id: api.apiId,
              name: `${api.tableName}-${selectedAccount.label}.pdf`,
              date: format(selectedDate, 'MMMM yyyy'),
              size: `${(res.data.length / 1024).toFixed(1)} KB`,
              data: res.data,
              colConfig: api,
            };
          })
        );
        setReports(data.filter(r => r.data.length));
        setApiError(false);
      } catch {
        setApiError(true);
        setReports([]);
      }
    })();
  }, [selectedAccount, selectedDate, apis, reportConfig.filterField]);

  const showTable = reports.length && !apiError;
  console.log(apis);
  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      <div className={filterContainer}>
        {latestDate && (
          <DatePicker
            isDaily={false}
            latestDate={latestDate}
            earliestDate={earliestDate}
            allDates={allDates}
            allYears={allYears}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            ignoreDisabled
            ariaLabel="Select month/year"
          />
        )}
        <GenerativeReportsAccountFilter apiData={apis} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
      </div>

      {!showTable && (
        <ReportsEmptyTable
          width={width}
          heading={apiError ? reportConfig.unmatchedHeader : reportConfig.defaultHeader}
          body={apiError ? reportConfig.unmatchedMessage : reportConfig.defaultMessage}
          apiErrorMessage={apiError}
        />
      )}

      {showTable && <DownloadReportTable isDailyReport={false} generatedReports={reports} setApiErrorMessage={setApiError} width={width} />}
    </DatasetSectionContainer>
  );
};

export default withWindowSize(FilterReportsSection);
