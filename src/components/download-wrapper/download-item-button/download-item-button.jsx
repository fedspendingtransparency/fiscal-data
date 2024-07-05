import React, { useEffect, useState } from 'react';
import { downloadItemBtn, linkDisabled, dictionary, optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';
import { generateAnalyticsEvent } from '../../../layouts/dataset-detail/helper';
import globalConstants from '../../../helpers/constants';
import { CSVLink } from 'react-csv';
import { useRecoilValue } from 'recoil';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import { constructDownloadFileName } from '../download-helpers';

export const downloadFileEventStr = globalConstants.gaEventLabels.downloadFile;
const DownloadItemButton = ({
  label,
  icon,
  fileSize,
  asyncAction,
  handleClick,
  href,
  download,
  disabled,
  selectedTable,
  dateRange,
  directCSVDownload,
  directJSONDownload,
  directXMLDownload,
}) => {
  const smallTableCSVData = useRecoilValue(smallTableDownloadDataCSV);
  const smallTableJSONData = useRecoilValue(smallTableDownloadDataJSON);
  const smallTableXMLData = useRecoilValue(smallTableDownloadDataXML);
  const [downloadName, setDownloadName] = useState(null);

  useEffect(() => {
    setDownloadName(constructDownloadFileName(dateRange, selectedTable));
  }, [dateRange, selectedTable]);

  const clickFunction = () => {
    if (handleClick) {
      handleClick();
    }

    if (download) {
      // Downloading a published report
      Analytics.event({
        category: 'Data Download',
        action: download,
      });
    } else {
      // Downloading raw data.
      generateAnalyticsEvent(downloadFileEventStr);
    }
  };

  const ButtonComponent = ({ children }) => {
    if (disabled) {
      return (
        <button disabled className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`} data-testid="download-button">
          {children}
        </button>
      );
    } else if (directCSVDownload && smallTableCSVData.length > 0) {
      return (
        <CSVLink
          data-testid="csv-download-button"
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data={smallTableCSVData}
          filename={downloadName + '.csv'}
        >
          {children}
        </CSVLink>
      );
    } else if (directJSONDownload && smallTableJSONData.length > 0) {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="json-download-button"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(smallTableJSONData)}`}
          download={downloadName + '.json'}
        >
          {children}
        </a>
      );
    } else if (directXMLDownload && smallTableXMLData.length > 0) {
      let smallTableXMLData2 = '<?xml version="1.0" encoding="UTF-8"?><root-element><data><data-element><record_date>NICOLLE</record_date><type>Total</type><public_prin_borrowings_amt>21547759724058.27</public_prin_borrowings_amt> <public_prin_repayments_amt>20180954532736.88</public_prin_repayments_amt> <public_interest_accrued_amt>445416941012.02</public_interest_accrued_amt> <public_interest_paid_amt>433213532978.59</public_interest_paid_amt> <public_net_unamortized_amt>-247609733757.52</public_net_unamortized_amt> <public_net_amortization_amt>-235639090828.11</public_net_amortization_amt> <intragov_prin_net_increase_amt>332879277182.76</intragov_prin_net_increase_amt> <intragov_interest_accrued_amt>168210307241.85</intragov_interest_accrued_amt> <intragov_interest_paid_amt>189837393552.90</intragov_interest_paid_amt> <intragov_net_unamortized_amt>-54178312240.36</intragov_net_unamortized_amt> <intragov_net_amortization_amt>1609571417.91</intragov_net_amortization_amt></data-element></data></root-element>';
      console.log('smallTableXMLData: ', smallTableXMLData);
      console.log('smallTableXMLData2: ', smallTableXMLData2);
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          data-testid="xml-download-button"
          href={`data:text/xml;charset=utf-8,${encodeURIComponent(smallTableXMLData2)}`}
          download={downloadName + '.xml'}
        >
          {children}
        </a>
      );
    } else {
      return (
        <a
          className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
          href={href}
          download={download}
          target="_blank"
          rel="noreferrer noopener"
          onClick={clickFunction}
          data-testid="download-button"
        >
          {children}
        </a>
      );
    }
  };

  return (
    <div>
      {asyncAction ? (
        <button className={dictionary} onClick={asyncAction} disabled={disabled}>
          <span className="labelText">{label} </span>
          {fileSize && <span className="fileSize"> ({fileSize})</span>}
        </button>
      ) : (
        <ButtonComponent>
          <span className={optionIcon}>{icon}</span>
          <span className="labelText">{label} </span>
          {fileSize && <span className="fileSize"> ({fileSize})</span>}
        </ButtonComponent>
      )}
    </div>
  );
};
export default DownloadItemButton;
