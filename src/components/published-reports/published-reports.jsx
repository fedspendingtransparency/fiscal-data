import React, { useEffect, useState } from 'react';
import {
  container,
  leftContent,
  rightContent,
  downloadWrapper
} from "./published-reports.module.scss";
import FilterSection from './filter-section/filter-section';
import Preview from './preview/preview';
import DownloadReport from './download-report/download-report';
import {isEqual} from "date-fns";

const PublishedReports = ({ reports, dataset }) => {
  const [selectedReportGroup, setSelectedReportGroup] = useState(reports);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportToShow, setReportToShow] = useState(null);

  useEffect(() => {
    setSelectedReportGroup(reports);
  }, [reports]);

  useEffect(() => {
    if (!selectedFile) {
      setReportToShow(null);
      return;
    }
    if (reportToShow &&
      (selectedFile.report_group_desc === reportToShow.report_group_desc
        && isEqual(selectedFile.report_date, reportToShow.report_date) && isEqual(selectedFile.path, reportToShow.path))) return;

    setReportToShow(selectedFile);
  }, [selectedFile]);


  return (
    <>
      <div className={container} data-testid="filterDownloadContainer">
        <div className={leftContent}>
          <FilterSection reports={selectedReportGroup}
                         setSelectedFile={setSelectedFile}
                         reportsTip={dataset.publishedReportsTip}
          />
        </div>
        <div className={rightContent}>
          <div data-testid="downloadSection" className={downloadWrapper}>
            <DownloadReport reportFile={reportToShow} isPublishedReport />
          </div>
        </div>
      </div>
      <Preview selectedFile={reportToShow} />
    </>
  )
};

export default PublishedReports;
