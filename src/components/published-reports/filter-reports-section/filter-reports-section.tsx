import React, { FunctionComponent, useState } from 'react';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import EmptyTable from '../reports-empty-table/reports-empty-table';
import { DownloadReportTable } from '../download-report-table/download-report-table';
import { withWindowSize } from 'react-fns';

const title = 'Reports and Files';

const PublishedReports: FunctionComponent = ({ pageConfig, width }) => {
  const [activeReports, setActiveReports] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState(false);
  const [noMatchingData, setNoMatchingData] = useState(false);
  return (
    <DatasetSectionContainer title={title} id="reports-and-files">
      {(activeReports?.length === 0 || apiErrorMessage) && (
        <EmptyTable width={width} apiErrorMessage={apiErrorMessage} noMatchingData={noMatchingData} />
      )}
      {activeReports?.length > 0 && !apiErrorMessage && (
        <DownloadReportTable isDailyReport={false} generatedReports={activeReports} width={width} setApiErrorMessage={setApiErrorMessage} />
      )}
    </DatasetSectionContainer>
  );
};

export default withWindowSize(PublishedReports);
