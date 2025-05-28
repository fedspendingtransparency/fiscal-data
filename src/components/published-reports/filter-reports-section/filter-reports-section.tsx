import React, { FunctionComponent, useState } from 'react';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import EmptyTable from '../reports-empty-table/reports-empty-table';
import { DownloadReportTable } from '../download-report-table/download-report-table';
import { withWindowSize } from 'react-fns';
import { IRunTimeReportConfig } from '../../../models/IRunTimeReportConfig';
import { sectionTitle } from '../published-reports';

const PublishedReports: FunctionComponent<{ reportConfig: IRunTimeReportConfig; width: number }> = ({ reportConfig, width }) => {
  const { unmatchedHeader, unmatchedMessage, defaultHeader, defaultMessage } = reportConfig;
  const [activeReports, setActiveReports] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState(false);
  const [noMatchingData, setNoMatchingData] = useState(false);
  const heading = noMatchingData ? unmatchedHeader : defaultHeader;
  const body = noMatchingData ? unmatchedMessage : defaultMessage;

  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      {(activeReports?.length === 0 || apiErrorMessage) && (
        <EmptyTable width={width} apiErrorMessage={apiErrorMessage} heading={heading} body={body} />
      )}
      {activeReports?.length > 0 && !apiErrorMessage && (
        <DownloadReportTable isDailyReport={false} generatedReports={activeReports} width={width} setApiErrorMessage={setApiErrorMessage} />
      )}
    </DatasetSectionContainer>
  );
};

export default withWindowSize(PublishedReports);
