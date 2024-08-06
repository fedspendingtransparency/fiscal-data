import * as React from 'react';
import { copyButton, cancelButton as cancelButtonStyle } from './buttons.module.scss';
import { generateAnalyticsEvent } from '../../layouts/dataset-detail/helper';
import globalConstants from '../../helpers/constants';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../recoil/reactTableFilteredState';

export const gaCopyLabelStr = globalConstants.gaEventLabels.copyDLLink;
const cancelButton = (
  downloadObj: Record<string, unknown>,
  cancelDownloadCallback: (downloadObj: Record<string, unknown>) => Record<string, unknown>
): JSX.Element => {
  if (!downloadObj || !cancelDownloadCallback) {
    console.info('CancelButton called to render with no associated download id');
    return null;
  }

  const cancelAction = (): void => {
    cancelDownloadCallback(downloadObj);
  };

  return (
    <button className={cancelButtonStyle} onClick={cancelAction}>
      Cancel Download
    </button>
  );
};

const copyToClipboardButton = (copyText: string, gaLabel: string, label = 'Copy Link'): JSX.Element => {
  if (!copyText) {
    console.info('copyToClipboardButton called without text to copy');
    return null;
  }

  const copyAction = (): void => {
    if (gaLabel) {
      generateAnalyticsEvent(gaLabel, gaCopyLabelStr + ' Click');
    }
    window.navigator.clipboard
      .writeText(copyText)
      .then(() => {
        // let donothing = true;
      })
      .catch(e => {
        console.warn('Writing text to clipboard failed. Error message - ', e);
      });
  };

  return (
    <button className={copyButton} onClick={copyAction}>
      {label}
    </button>
  );
};

const buttons = {
  cancelButton,
  copyToClipboardButton,
};

export default buttons;
