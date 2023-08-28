import React, { useEffect, useState } from 'react';
import PageHelmet from "../../components/page-helmet/page-helmet"
import * as styles from "./downloads.module.scss"
import { Link } from "gatsby"
import LocationAware from '../../components/location-aware/location-aware';
import downloadService from '../../helpers/download-service/download-service';
import globalConstants from "../../helpers/constants";
import { DATA_DOWNLOAD_BASE_URL } from 'gatsby-env-variables';
import {downloadPageTextContent} from "../../helpers/downloads/download-content-helper";

export const DownloadsPage = ({ location }) => {

  const [downloadToken, setDownloadToken] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [downloadReadyUrl, setDownloadReadyUrl] = useState(null);
  const [downloadIsBeingPrepared, setDownloadIsBeingPrepared] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [downloadStatusSubscription, setDownloadStatusSubscription] = useState(null);

  const getDownloadTokenFromUrl = (location) => {
    if (location && location.pathname) {
      const segments = location.pathname.split(/[/?]+/).filter(seg => seg.length > 0);
      // Handle situations where a user navigates to /downloads/ but there's no token
      const token =  segments.length > 1 ? segments[segments.length - 1].toLocaleLowerCase() : null;
      if (token) {
        // basic sanitization to ensure token only contains valid hexadecimal chars
        return token.toString().replace(/[^0-9a-f]/gi, '');
      }
      return null;
    }
  };

  const unsubscribe = () => {
    if (downloadStatusSubscription) {
      downloadStatusSubscription.unsubscribe();
    }
  };

  useEffect(() => {
    setDownloadToken(getDownloadTokenFromUrl(location));
  }, [location]);

  useEffect(() => {
    if (downloadToken) {
      const subscription = downloadService.startPollingByRequestToken(downloadToken).subscribe({
        next: (statusObj) => {
          if (statusObj?.status === 'completed' && statusObj?.file_path) {
            const filePath =
              `${globalConstants.DATA_DOWNLOAD_STATUS_PREFIX}/${statusObj.file_path}`;
            const fileUrl =
              DATA_DOWNLOAD_BASE_URL ? `${DATA_DOWNLOAD_BASE_URL}${filePath}` : filePath;
            setDownloadReadyUrl(fileUrl);
            setDownloadIsBeingPrepared(false);
            setDownloadError(false);
            window.location.assign(fileUrl);
          } else if (statusObj?.status === 'failed') {
            setDownloadError(true);
            setDownloadIsBeingPrepared(false);
          } else if (statusObj?.status !== 'completed') {
            setDownloadIsBeingPrepared(true);
            setDownloadError(false);
          }
          setChecking(false);
        },
        error: (error) => {
          setDownloadIsBeingPrepared(false);
          setDownloadError(true);
          setChecking(false);
          console.error(error);
        },
        complete: () => {}
      });
      setDownloadStatusSubscription(subscription);
    } else if (downloadToken === null) {
      setDownloadError(true);
    }
    return unsubscribe;
  }, [downloadToken]);

  return (
    <div>
      <PageHelmet data-testid="helmet"
                  pageTitle="Downloads"
                  description="Check the status of a download request and download that data."
                  keywords=""
      />
      <div className={styles.content}>
        <Link role="img"
              title="Return to home page"
              alt="Fiscal Data Homepage"
              to="/"
              data-testid="logo"
              className={styles.logo}
              aria-label="Fiscal Data logo - return to home page"
        />
        <div data-testid="image-container"
             className={[
          `${styles.graphic}`,
          `${downloadError ? styles.errorGraphic : ''}`].join(' ')}
             aria-label="Image"
        >&nbsp;
        </div>
        <div className={styles.textContent}>
          <div className={[
            `${styles.header}`,
            `${downloadError ? styles.error : ''}`].join(' ')}
          >
            <h1 data-testid="header">
              {downloadError ? downloadPageTextContent.dlErrorHeader :
                checking ? downloadPageTextContent.checking :
                  downloadIsBeingPrepared ?
                    downloadPageTextContent.dlBeingPreparedHeader :
                    downloadPageTextContent.dlReadyHeader }
            </h1>
          </div>
          <div className={styles.text} data-testid="full-message">
            {downloadError ? downloadPageTextContent.dlErrorText :
              checking ? downloadPageTextContent.checking :
                downloadIsBeingPrepared ?
                  downloadPageTextContent.dlBeingPreparedText :
                  downloadPageTextContent.dlReadyText}
          </div>
        </div>
      </div>
    </div>
  );
};

const Downloads = LocationAware(DownloadsPage);

export default Downloads;
