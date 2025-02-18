import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { container, downloadButton, border } from './download-dialog.module.scss';

interface IDownloadOption {
  displayName: string;
  onClick: () => void;
  size: string;
  topBorder?: boolean;
}

interface IDownloadDialog {
  active: boolean;
  setActive: (activeState: boolean) => void;
  downloadOptions: IDownloadOption[];
}

export const DownloadDialog: FunctionComponent<IDownloadDialog> = ({ active, setActive, downloadOptions }) => {
  const containerRef = useRef(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (!inFocus) {
      setActive(false);
    }
  }, [inFocus]);

  return (
    <>
      {active ? (
        <div
          className={container}
          role="presentation"
          ref={containerRef}
          onFocus={() => setInFocus(true)}
          onBlur={e => {
            // if (!e.relatedTarget.className.includes('download-dialog')) {
            //   setInFocus(false);
            // }
          }}
        >
          {downloadOptions?.map(option => {
            const { displayName, size, onClick, topBorder } = option;
            return (
              <>
                {topBorder ? <div className={border} /> : null}
                <button className={downloadButton} onClick={onClick}>
                  <span>{displayName}</span>
                  <span>{size}</span>
                </button>
              </>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
