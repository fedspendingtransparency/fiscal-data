import React, {useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import {
  titleContainer,
  headerWrapper,
  header,
  previewContent,
  textReportContainer,
  textReportPreview
} from './preview.module.scss';
import NotShownMessage
  from "../../dataset-data/table-section-container/not-shown-message/not-shown-message";
import Analytics from '../../../utils/analytics/analytics';
import { getIFetch } from "../../../utils/api-utils"

const Preview = ({ selectedFile }) => {
  const [isPdf, setIsPdf] = useState(true);
  const [isTxt, setIsTxt] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [previousSelectedPath, setPreviousSelectedPath] = useState(null);
  const [reportTextContent, setReportTextContext] = useState('');

  let altText;

  // todo - Revisit the altText below. This is very specific and can be refined to be more
  //  generic for all datasets and different file types.
  if (selectedFile && selectedFile.report_group_desc === 'Monthly Treasury Statement (.pdf)') {
    altText = 'Preview the downloadable PDF report of the MTS Receipts and Outlays of the U.S.' +
    ' Government for the selected month and year for the previous five years.'
  } else if (selectedFile && selectedFile.report_group_desc === 'Entire (.pdf)') {
    altText = 'Preview the downloadable PDF report of the MSPD for the selected month and year' +
      ' for the previous five years.';
  }

  useEffect(() => {
    if (selectedFile
      && selectedFile.path !== previousSelectedPath
      && selectedFile.report_group_desc
      && selectedFile.path) {
      setPreviousSelectedPath(selectedFile);
      const groupName = selectedFile.report_group_desc.toLowerCase();
      const pdfTextBool = groupName.indexOf('(.pdf)') !== -1;
      setIsPdf(pdfTextBool);
      const txtTextBool = groupName.indexOf('(.txt)') !== -1;
      setIsTxt(txtTextBool);
      if (pdfTextBool) {
        // GA4 Data Layer - Published Report Preview
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'Published Report Preview',
          'eventLabel': selectedFile.path
        });
        Analytics.event({
          'category': 'Published Report Preview',
          'action': 'load pdf preview',
          'value': selectedFile.path
        });
      } else if (txtTextBool)  {
        getIFetch()(selectedFile.path).then(res => res.text()).then(textFile => {
                  setReportTextContext(textFile);
                  });
        // GA4 Data Layer - Published Report Preview
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'Published Report Preview',
          'eventLabel': selectedFile.path
        });

        Analytics.event({
          'category': 'Published Report Preview',
          'action': 'load text preview',
          'value': selectedFile.path
        });
      } else {
        const fileTypeIdx = groupName.indexOf('(.');
        let newFileType = null;
        if (fileTypeIdx !== -1) {
          newFileType = groupName.substring(fileTypeIdx + 1, groupName.indexOf(')'));
        } else {
          const matched = selectedFile.path.match(/\.[A-Za-z0-1]{2,6}$/);
          if (matched?.length === 1) { // checking for char grouping
            newFileType = matched[0];
          }
        }
        setFileType(newFileType);
      }
    }
  }, [selectedFile]);

  return (
    <>
      <div className={titleContainer}>
        <div className={headerWrapper}>
          <FontAwesomeIcon icon={faTable}
                           data-testid="tableIcon"
                           size="1x"
          />
          <h3 className={header}
              data-testid="title"
              id="main-data-table-title"
          >
            {selectedFile && selectedFile.report_group_desc}
          </h3>
        </div>
      </div>
      <div data-testid="previewContent" className={previewContent}>
        {
          selectedFile ?
            isPdf ?
              <embed src={selectedFile.path}
                     type="application/pdf"
                     data-test-id="embedElement"
                     title={altText}
              />
              :
              isTxt ?
                <div className={textReportContainer}>
                  <pre className={textReportPreview}>
                    {reportTextContent}
                  </pre>
                </div>
                :
                <NotShownMessage
                  heading="Preview cannot be displayed for this file type."
                    bodyText={`The selected file type is ${fileType !== null ?
                      fileType : 'unknown'}`}
                />
          : <NotShownMessage heading="Select a Report Above To Generate A Preview" />
        }
      </div>
    </>
  )
};

export default Preview;
